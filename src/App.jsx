import { useEffect, useMemo, useRef, useState } from 'react';
import DeviceBar from './components/System/DeviceBar.jsx';
import StatusBar from './components/System/StatusBar.jsx';
import FileManager from './components/FileSystem/FileManager.jsx';
import TextEditor from './components/Editor/TextEditor.jsx';
import QRExportModal from './components/QR/QRExportModal.jsx';
import QRImportModal from './components/QR/QRImportModal.jsx';
import HelpModal from './components/System/HelpModal.jsx';
import SettingsModal from './components/System/SettingsModal.jsx';
import InfoModal from './components/System/InfoModal.jsx';
import ManualModal from './components/System/ManualModal.jsx';
import FindPanel from './components/System/FindPanel.jsx';
import ShortcutBar from './components/System/ShortcutBar.jsx';
import { useFileSystem } from './contexts/FileSystemContext.jsx';
import { useOS } from './contexts/OSContext.jsx';
import { useShortcuts } from './hooks/useShortcuts.js';
import { useBattery } from './hooks/useBattery.js';
import { buildTextMetrics } from './utils/text.js';

const App = () => {
  const {
    entries,
    currentFolder,
    setFolder,
    createFile,
    createFolder,
    renameEntry,
    selectedEntryId,
    setSelectedEntryId,
    activeFileId,
    setActiveFileId,
    updateFileContent
  } = useFileSystem();

  const {
    view,
    setView,
    statusBarsVisible,
    toggleStatusBars,
    modals,
    openModal,
    closeModal,
    closeTopModal,
    settings,
    updateSetting,
    setCapsLock,
    capsLock
  } = useOS();

  const selectedEntry = selectedEntryId ? entries[selectedEntryId] : null;
  const activeFile = activeFileId ? entries[activeFileId] : null;
  const [editorContent, setEditorContent] = useState('');
  const [status, setStatus] = useState({ cursor: '1:1', words: 0, size: '0 KiB', scroll: '0%' });
  const [metrics, setMetrics] = useState(buildTextMetrics(''));
  const [isDirty, setIsDirty] = useState(false);
  const timeFormat = { hour: '2-digit', minute: '2-digit', hour12: false };
  const [time, setTime] = useState(() => new Date().toLocaleTimeString([], timeFormat));
  const [findVisible, setFindVisible] = useState(false);
  const battery = useBattery();
  const editorRef = useRef(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date().toLocaleTimeString([], timeFormat));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setEditorContent(activeFile?.content || '');
    setMetrics(buildTextMetrics(activeFile?.content || ''));
    setIsDirty(false);
    if (activeFileId) {
      setSelectedEntryId(activeFileId);
    }
  }, [activeFileId, activeFile?.content, setSelectedEntryId]);

  useEffect(() => {
    const handler = (event) => {
      setCapsLock(event.getModifierState?.('CapsLock'));
    };
    window.addEventListener('keydown', handler);
    window.addEventListener('keyup', handler);
    return () => {
      window.removeEventListener('keydown', handler);
      window.removeEventListener('keyup', handler);
    };
  }, [setCapsLock]);

  const handleOpenFile = (entry) => {
    setActiveFileId(entry.id);
    setView('editor');
  };

  const handleSave = () => {
    if (!activeFileId) return;
    updateFileContent(activeFileId, editorContent);
    setIsDirty(false);
  };

  useEffect(() => {
    if (!isDirty || !activeFileId) return undefined;
    const timer = setTimeout(() => handleSave(), settings.autoSaveInterval);
    return () => clearTimeout(timer);
  }, [isDirty, activeFileId, editorContent, settings.autoSaveInterval]);

  useEffect(() => {
    setMetrics(buildTextMetrics(editorContent));
  }, [editorContent]);

  const handleImport = (text) => {
    const file = createFile(`Imported_${new Date().toISOString()}.md`);
    updateFileContent(file.id, text);
    setActiveFileId(file.id);
    setView('editor');
  };

  const handleRenameShortcut = () => {
    if (view === 'editor' && activeFile) {
      const nextName = window.prompt('Rename file', activeFile.name);
      if (nextName) {
        renameEntry(activeFile.id, nextName);
      }
      return;
    }
    if (selectedEntry) {
      const nextName = window.prompt('Rename item', selectedEntry.name);
      if (nextName) {
        renameEntry(selectedEntry.id, nextName);
      }
    }
  };

  const handleFindSubmit = ({ find, replace, replaceAll }) => {
    if (!find) return;
    if (replaceAll) {
      editorRef.current?.replaceAll(find, replace);
    } else {
      editorRef.current?.findNext(find);
    }
  };

  const escapeHandler = () => {
    if (closeTopModal()) return true;
    if (findVisible) {
      setFindVisible(false);
      return true;
    }
    if (view === 'editor') {
      setView('files');
      return true;
    }
    return false;
  };

  const handleInfoShortcut = () => {
    if (view === 'editor') {
      if (activeFile) openModal('info');
      return;
    }
    if (view === 'files' && selectedEntry?.type === 'file') {
      setActiveFileId(selectedEntry.id);
      openModal('info');
    }
  };

  useShortcuts({
    onHelp: () => openModal('help'),
    onRename: handleRenameShortcut,
    onNewFile: () => {
      const file = createFile();
      setActiveFileId(file.id);
      setView('editor');
    },
    onNewFolder: () => createFolder(),
    onRefresh: () => setRefreshKey((prev) => prev + 1),
    onToggleTransfer: () => {
      if (view === 'editor') openModal('qrExport');
      else openModal('qrImport');
    },
    onSettings: () => openModal('settings'),
    onInfo: handleInfoShortcut,
    onEscape: escapeHandler,
    onSave: handleSave,
    onQuit: () => setView('files'),
    onFind: () => {
      if (view === 'editor') {
        setFindVisible(true);
        editorRef.current?.focus?.();
      }
    },
    onToggleStatusBars: toggleStatusBars,
    onNavigateUp: () => {
      if (view === 'files' && currentFolder?.parentId) setFolder(currentFolder.parentId);
    },
    onManual: () => openModal('manual')
  });

  const deviceTitle = view === 'editor' ? activeFile?.name : currentFolder?.name || 'Documents';
  const statusLabel = isDirty ? 'dirty' : 'saved';

  return (
    <div className="min-h-screen bg-paper text-ink flex items-center justify-center p-2 md:p-6" key={refreshKey}>
      <div className="w-full h-screen md:w-[80vw] md:h-[80vh] max-w-6xl border-4 border-ink shadow-[0_25px_70px_rgba(0,0,0,0.35)] flex flex-col bg-paper overflow-hidden">
        <div className="flex-none sticky top-0 z-10 bg-paper">
          <DeviceBar
            view={view}
            fileName={deviceTitle}
            time={time}
            battery={battery}
            layout="EN"
            capsLock={capsLock}
            onBack={() => setView('files')}
          />
        </div>

        <main className="flex-1 overflow-hidden bg-paper">
          {view === 'files' && (
            <div className="h-full p-4 md:p-8">
              <FileManager onOpenFile={handleOpenFile} />
            </div>
          )}

          {view === 'editor' && activeFile && (
            <div className="h-full relative">
              <TextEditor
                ref={editorRef}
                value={editorContent}
                onChange={(value) => {
                  setEditorContent(value);
                  setIsDirty(true);
                }}
                onMetrics={setStatus}
                fontSize={settings.fontSize}
                fileId={activeFile?.id}
              />
              <FindPanel visible={findVisible} onClose={() => setFindVisible(false)} onSubmit={handleFindSubmit} />
            </div>
          )}
        </main>

        {statusBarsVisible && (
          <div className="flex-none sticky bottom-0 z-10 bg-paper">
            {view === 'editor' ? (
              <StatusBar status={statusLabel} cursor={status.cursor} words={status.words} size={status.size} />
            ) : (
              <ShortcutBar />
            )}
          </div>
        )}
      </div>

      {modals.help && <HelpModal onClose={() => closeModal('help')} />}
      {modals.settings && (
        <SettingsModal
          settings={settings}
          onUpdate={updateSetting}
          onClose={() => closeModal('settings')}
        />
      )}
      {modals.manual && <ManualModal onClose={() => closeModal('manual')} />}
      {modals.info && activeFile && (
        <InfoModal file={activeFile} metrics={metrics} onClose={() => closeModal('info')} />
      )}
      {modals.qrExport && activeFile && (
        <QRExportModal content={editorContent} fileName={activeFile.name} onClose={() => closeModal('qrExport')} />
      )}
      {modals.qrImport && <QRImportModal onImport={handleImport} onClose={() => closeModal('qrImport')} />}
    </div>
  );
};

export default App;
