import { useEffect, useRef } from 'react';
import { ArrowLeft, Info } from 'lucide-react';
import FileList from './FileList.jsx';
import { useFileSystem } from '../../contexts/FileSystemContext.jsx';

const FileManager = ({ onOpenFile }) => {
  const {
    currentFolderEntries,
    currentFolder,
    currentFolderId,
    entries,
    selectedEntryId,
    setSelectedEntryId,
    deleteEntry,
    setFolder
  } = useFileSystem();

  const selectedEntry = selectedEntryId ? entries[selectedEntryId] : null;
  const containerRef = useRef(null);

  useEffect(() => {
    containerRef.current?.focus();
  }, [currentFolderId]);

  const navigateUp = () => {
    if (currentFolder?.parentId) setFolder(currentFolder.parentId);
  };

  const handleOpen = (entry) => {
    if (entry.type === 'folder') {
      setFolder(entry.id);
    } else {
      onOpenFile(entry);
    }
  };

  const cycleSelection = (direction) => {
    if (!currentFolderEntries.length) return;
    const currentIndex = currentFolderEntries.findIndex((entry) => entry.id === selectedEntryId);
    let nextIndex = currentIndex;

    if (currentIndex === -1) {
      nextIndex = direction > 0 ? 0 : currentFolderEntries.length - 1;
    } else {
      nextIndex = (currentIndex + direction + currentFolderEntries.length) % currentFolderEntries.length;
    }
    setSelectedEntryId(currentFolderEntries[nextIndex].id);
  };

  const handleKeyDown = (event) => {
    const tag = event.target?.tagName?.toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      cycleSelection(1);
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      cycleSelection(-1);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      navigateUp();
    } else if (event.key === 'ArrowRight' && selectedEntry?.type === 'folder') {
      event.preventDefault();
      handleOpen(selectedEntry);
    } else if (event.key === 'Enter' && selectedEntry) {
      event.preventDefault();
      handleOpen(selectedEntry);
    } else if (event.key === 'Delete' && selectedEntry) {
      event.preventDefault();
      deleteEntry(selectedEntry.id);
    }
  };

  return (
    <div
      className="h-full flex flex-col gap-4 overflow-hidden focus:outline-none focus:ring-0"
      tabIndex={0}
      ref={containerRef}
      onKeyDown={handleKeyDown}
    >
      <div className="flex items-center justify-between text-xs uppercase tracking-[0.3em] border-b-2 border-ink pb-2">
        <div className="flex items-center gap-3">
          {currentFolder?.parentId && (
            <button type="button" className="flex items-center gap-1 hover:underline" onClick={navigateUp}>
              <ArrowLeft size={14} /> UP
            </button>
          )}
          <span className="opacity-70">{currentFolder?.name || 'Documents'}</span>
        </div>
        <div className="flex items-center gap-2 text-[10px]">
          <Info size={12} />
          <span>ENTER TO OPEN · DEL TO DELETE</span>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        <FileList entries={currentFolderEntries} selectedId={selectedEntryId} onOpen={handleOpen} onSelect={setSelectedEntryId} />
      </div>

      {selectedEntry && (
        <div className="border-t border-dashed border-ink/30 text-xs flex flex-wrap items-center gap-4 pt-2 justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold truncate max-w-[240px]">{selectedEntry.name}</span>
            <span className="tracking-widest uppercase">{selectedEntry.type}</span>
          </div>
          <div className="text-[11px] tracking-widest">
            Updated {new Date(selectedEntry.updatedAt).toLocaleString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileManager;
