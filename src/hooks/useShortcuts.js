import { useEffect } from 'react';

const FUNCTION_KEYS = Array.from({ length: 12 }, (_, index) => `F${index + 1}`);

export const useShortcuts = (handlers = {}) => {
  const {
    onHelp,
    onRename,
    onNewFile,
    onNewFolder,
    onRefresh,
    onToggleTransfer,
    onSettings,
    onInfo,
    onEscape,
    onSave,
    onQuit,
    onFind,
    onToggleStatusBars,
    onManual,
    onNavigateUp
  } = handlers;

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;
      const lower = key.toLowerCase();
      const modifier = event.ctrlKey || event.metaKey;
      const code = event.code;
      const target = event.target;
      const tag = target?.tagName?.toLowerCase();
      const isTypingTarget =
        tag === 'input' ||
        tag === 'textarea' ||
        target?.isContentEditable === true ||
        target?.getAttribute?.('role') === 'textbox';

      if (FUNCTION_KEYS.includes(key)) {
        event.preventDefault();
      }

      switch (key) {
        case 'F1':
          onHelp?.();
          return;
        case 'F2':
          onRename?.();
          return;
        case 'F3':
          onNewFile?.();
          return;
        case 'F4':
          onNewFolder?.();
          return;
        case 'F5':
          onRefresh?.();
          return;
        case 'F6':
          onToggleTransfer?.();
          return;
        case 'F7':
          onSettings?.();
          return;
        case 'F10':
          onInfo?.();
          return;
        default:
          break;
      }

      if (key === 'Escape') {
        if (onEscape?.() === true) return;
      }

      if (modifier) {
        if (code === 'KeyS') {
          event.preventDefault();
          onSave?.();
          return;
        }
        if (code === 'KeyN' && event.shiftKey) {
          event.preventDefault();
          onNewFolder?.();
          return;
        }
        if (code === 'KeyN' && !event.shiftKey) {
          event.preventDefault();
          onNewFile?.();
          return;
        }
        if (code === 'KeyQ') {
          event.preventDefault();
          onQuit?.();
          return;
        }
        if (code === 'KeyF') {
          event.preventDefault();
          onFind?.();
          return;
        }
      }

      if (event.altKey && code === 'KeyH') {
        event.preventDefault();
        onToggleStatusBars?.();
        return;
      }
      if (event.altKey && code === 'KeyM') {
        event.preventDefault();
        onManual?.();
        return;
      }

      if (key === 'Backspace' && onNavigateUp) {
        if (isTypingTarget) return;
        event.preventDefault();
        onNavigateUp();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    onEscape,
    onFind,
    onHelp,
    onInfo,
    onNavigateUp,
    onNewFile,
    onNewFolder,
    onQuit,
    onRefresh,
    onRename,
    onSave,
    onSettings,
    onToggleStatusBars,
    onToggleTransfer,
    onManual
  ]);
};
