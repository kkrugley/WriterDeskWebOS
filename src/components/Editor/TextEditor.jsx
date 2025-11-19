import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { getWordCount } from '../../utils/text.js';

const indentUnit = '\t';

const TextEditor = forwardRef(({ value, onChange, onMetrics, fontSize, fileId }, ref) => {
  const textAreaRef = useRef(null);
  const historyRef = useRef({ undo: [], redo: [] });
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0 });

  const reportStatus = (content, target = textAreaRef.current) => {
    const selectionStart = target?.selectionStart ?? 0;
    const preceding = content.slice(0, selectionStart);
    const line = preceding.split(/\n/).length;
    const column = preceding.length - preceding.lastIndexOf('\n');
    const words = getWordCount(content);
    const bytes = new Blob([content]).size;
    const scrollPercent = target
      ? Math.round((target.scrollTop / Math.max(1, target.scrollHeight - target.clientHeight)) * 100)
      : 0;

    onMetrics?.({
      cursor: `${line}:${column}`,
      words,
      size: `${(bytes / 1024).toFixed(2)} KiB`,
      scroll: `${Number.isFinite(scrollPercent) ? scrollPercent : 0}%`
    });
  };

  useEffect(() => {
    reportStatus(value);
  }, [value]);

  useEffect(() => {
    const handleClick = () => {
      setContextMenu((prev) => (prev.visible ? { ...prev, visible: false } : prev));
    };
    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    historyRef.current = { undo: [], redo: [] };
  }, [fileId]);

  const execCommand = (command) => {
    const textarea = textAreaRef.current;
    if (!textarea || typeof document.execCommand !== 'function') return;
    textarea.focus();
    try {
      document.execCommand(command);
    } catch {
      // Ignore unsupported commands
    }
  };

  const getSelectionData = () => {
    const textarea = textAreaRef.current;
    if (!textarea) return null;
    const { selectionStart, selectionEnd } = textarea;
    if (selectionStart == null || selectionEnd == null) return null;
    return {
      selectionStart,
      selectionEnd,
      text: value.slice(selectionStart, selectionEnd)
    };
  };

  const commitChange = (nextValue, nextStart, nextEnd, options = {}) => {
    const { recordHistory = true } = options;
    const textarea = textAreaRef.current;
    if (recordHistory && textarea) {
      historyRef.current.undo.push({
        value,
        selectionStart: textarea.selectionStart ?? 0,
        selectionEnd: textarea.selectionEnd ?? 0
      });
      historyRef.current.redo = [];
    }
    onChange(nextValue);
    requestAnimationFrame(() => {
      const current = textAreaRef.current;
      const safeStart = Math.max(0, Math.min(nextStart, nextValue.length));
      const safeEnd = Math.max(safeStart, Math.min(nextEnd, nextValue.length));
      current?.focus();
      current?.setSelectionRange(safeStart, safeEnd);
      reportStatus(nextValue, current);
    });
  };

  const insertTextAtSelection = (text) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const { selectionStart = 0, selectionEnd = 0 } = textarea;
    const before = value.slice(0, selectionStart);
    const after = value.slice(selectionEnd);
    const newValue = before + text + after;
    const nextCursor = selectionStart + text.length;
    commitChange(newValue, nextCursor, nextCursor);
  };

  const wrapSelection = (prefix, suffix = prefix) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const { selectionStart = 0, selectionEnd = 0 } = textarea;
    if (selectionStart === selectionEnd) return;
    const before = value.slice(0, selectionStart);
    const selected = value.slice(selectionStart, selectionEnd);
    const after = value.slice(selectionEnd);
    const newValue = `${before}${prefix}${selected}${suffix}${after}`;
    commitChange(newValue, selectionStart + prefix.length, selectionEnd + prefix.length);
  };

  const copySelection = async (remove = false) => {
    const selection = getSelectionData();
    if (!selection?.text) return;
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(selection.text);
      } else {
        throw new Error('Clipboard API unavailable');
      }
    } catch {
      if (remove) execCommand('cut');
      else execCommand('copy');
      return;
    }
    if (remove) insertTextAtSelection('');
  };

  const pasteClipboard = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) insertTextAtSelection(text);
        return;
      }
      throw new Error('Clipboard API unavailable');
    } catch {
      execCommand('paste');
    }
  };

  const adjustIndent = (direction = 1) => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;

    if (start === end && direction > 0) {
      insertTextAtSelection(indentUnit);
      return;
    }

    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split('\n');

    const updatedLines = lines.map((line) => {
      if (direction > 0) {
        return `${indentUnit}${line}`;
      }
      if (line.startsWith(indentUnit)) return line.slice(indentUnit.length);
      if (line.startsWith('  ')) return line.slice(2);
      return line;
    });

    const updatedBlock = updatedLines.join('\n');
    const firstDiff = updatedLines[0].length - lines[0].length;
    const totalDiff = updatedBlock.length - block.length;
    const nextValue = value.slice(0, lineStart) + updatedBlock + value.slice(lineEnd);
    const nextStart = start + firstDiff;
    const nextEnd = end + totalDiff;
    commitChange(nextValue, nextStart, nextEnd);
  };

  const applyHangingIndent = () => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split('\n');
    if (lines.length <= 1) {
      insertTextAtSelection(`\n${indentUnit}`);
      return;
    }
    const updatedLines = lines.map((line, index) => (index === 0 ? line : `${indentUnit}${line}`));
    const updatedBlock = updatedLines.join('\n');
    const totalDiff = updatedBlock.length - block.length;
    const nextValue = value.slice(0, lineStart) + updatedBlock + value.slice(lineEnd);
    commitChange(nextValue, start, end + totalDiff);
  };

  const applyUnorderedList = () => {
    const textarea = textAreaRef.current;
    if (!textarea) return;
    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? start;
    const lineStart = value.lastIndexOf('\n', start - 1) + 1;
    let lineEnd = value.indexOf('\n', end);
    if (lineEnd === -1) lineEnd = value.length;
    const block = value.slice(lineStart, lineEnd);
    const lines = block.split('\n');
    const updatedLines = lines.map((line) => {
      const trimmed = line.trimStart();
      if (trimmed.startsWith('- ')) return line;
      return `- ${line}`;
    });
    const updatedBlock = updatedLines.join('\n');
    const firstDiff = updatedLines[0].length - lines[0].length;
    const totalDiff = updatedBlock.length - block.length;
    const nextValue = value.slice(0, lineStart) + updatedBlock + value.slice(lineEnd);
    commitChange(nextValue, start + firstDiff, end + totalDiff);
  };

  const insertPageBreak = () => insertTextAtSelection('\n---\n');
  const insertNonBreakingSpace = () => insertTextAtSelection('\u00A0');

  const justifySelection = () => {
    const selection = getSelectionData();
    if (!selection || !selection.text) return;
    wrapSelection('<div class="justify">\n', '\n</div>');
  };

  const applyHistory = (type) => {
    const source = historyRef.current[type];
    const target = historyRef.current[type === 'undo' ? 'redo' : 'undo'];
    const snapshot = source.pop();
    if (!snapshot) return;
    const textarea = textAreaRef.current;
    if (textarea) {
      target.push({
        value,
        selectionStart: textarea.selectionStart ?? 0,
        selectionEnd: textarea.selectionEnd ?? 0
      });
    }
    commitChange(snapshot.value, snapshot.selectionStart, snapshot.selectionEnd, { recordHistory: false });
  };

  const handleUndoRedoShortcut = (event) => {
    const modifier = event.ctrlKey || event.metaKey;
    if (!modifier) return false;
    if (event.code === 'KeyZ' && !event.shiftKey) {
      event.preventDefault();
      applyHistory('undo');
      return true;
    }
    if ((event.code === 'KeyY') || (event.code === 'KeyZ' && event.shiftKey)) {
      event.preventDefault();
      applyHistory('redo');
      return true;
    }
    return false;
  };

  const handleEditorKeyDown = (event) => {
    if (handleUndoRedoShortcut(event)) return;

    if (event.key === 'Tab' && !(event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      adjustIndent(event.shiftKey ? -1 : 1);
      return;
    }

    const modifier = event.ctrlKey || event.metaKey;
    if (!modifier) return;

    switch (event.code) {
      case 'KeyB':
        event.preventDefault();
        wrapSelection('**');
        return;
      case 'KeyI':
        event.preventDefault();
        wrapSelection('*');
        return;
      case 'KeyU':
        event.preventDefault();
        applyUnorderedList();
        return;
      case 'KeyM':
        event.preventDefault();
        adjustIndent(event.shiftKey ? -1 : 1);
        return;
      case 'KeyT':
        event.preventDefault();
        applyHangingIndent();
        return;
      case 'Enter':
        event.preventDefault();
        insertPageBreak();
        return;
      case 'Space':
        if (event.shiftKey) {
          event.preventDefault();
          insertNonBreakingSpace();
        }
        return;
      case 'KeyJ':
        event.preventDefault();
        justifySelection();
        return;
      default:
        return;
    }
  };

  useImperativeHandle(ref, () => ({
    focus: () => textAreaRef.current?.focus(),
    findNext: (query) => {
      if (!query) return;
      const current = textAreaRef.current;
      if (!current) return;
      const startIndex = current.selectionEnd ?? 0;
      const index = value.indexOf(query, startIndex);
      const targetIndex = index >= 0 ? index : value.indexOf(query);
      if (targetIndex >= 0) {
        current.setSelectionRange(targetIndex, targetIndex + query.length);
        current.focus();
      }
    },
    replaceAll: (query, replacement) => {
      if (!query) return;
      onChange(value.split(query).join(replacement));
    }
  }));

  const handleContextMenu = (event) => {
    event.preventDefault();
    const { clientX, clientY } = event;
    const padding = 8;
    const menuWidth = 200;
    const menuHeight = 220;
    const x = Math.min(clientX, window.innerWidth - menuWidth - padding);
    const y = Math.min(clientY, window.innerHeight - menuHeight - padding);
    setContextMenu({ visible: true, x, y });
  };

  const handleMenuAction = (action) => {
    action();
    setContextMenu((prev) => ({ ...prev, visible: false }));
  };

  const menuItems = [
    { label: 'Copy', action: () => copySelection(false) },
    { label: 'Cut', action: () => copySelection(true) },
    { label: 'Paste', action: () => pasteClipboard() },
    { type: 'divider' },
    { label: 'Bold (**)', action: () => wrapSelection('**') },
    { label: 'Italic (*)', action: () => wrapSelection('*') },
    { label: 'Unordered List (- )', action: () => applyUnorderedList() }
  ];

  return (
    <div className="h-full w-full p-4 md:p-8" onContextMenu={handleContextMenu}>
      <textarea
        ref={textAreaRef}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
          reportStatus(event.target.value, event.target);
        }}
        onScroll={(event) => reportStatus(event.target.value, event.target)}
        onKeyDown={handleEditorKeyDown}
        spellCheck={false}
        className="w-full h-full min-h-full bg-paper text-ink outline-none resize-none p-6 md:p-10 leading-relaxed tracking-wide overflow-auto"
        style={{ fontSize }}
        autoFocus
      />
      {contextMenu.visible && (
        <div
          className="fixed z-50 bg-paper border-2 border-ink shadow-crt text-xs uppercase tracking-widest min-w-[180px]"
          style={{ top: contextMenu.y, left: contextMenu.x }}
          onClick={(event) => event.stopPropagation()}
        >
          {menuItems.map((item, index) =>
            item.type === 'divider' ? (
              <div key={`divider-${index}`} className="px-4 py-1 text-center text-xs tracking-[0.5em] text-ink/60">
                •••
              </div>
            ) : (
              <button
                type="button"
                key={item.label}
                onClick={() => handleMenuAction(item.action)}
                className="w-full text-left px-4 py-2 border-b border-dashed border-ink/30 hover:bg-ink hover:text-paper transition-colors last:border-b-0"
              >
                {item.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
});

export default TextEditor;
