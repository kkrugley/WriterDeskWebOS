import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import {
  createEntry,
  duplicateEntry,
  loadFileSystem,
  persistFileSystem,
  removeEntryTree
} from '../utils/fs.js';

const FileSystemContext = createContext(undefined);
const initialFS = loadFileSystem();

export const FileSystemProvider = ({ children }) => {
  const [state, setState] = useState(initialFS);
  const [currentFolderId, setCurrentFolderId] = useState(initialFS.rootId);
  const [activeFileId, setActiveFileId] = useState(null);
  const [selectedEntryId, setSelectedEntryId] = useState(null);

  useEffect(() => {
    persistFileSystem(state);
  }, [state]);

  const entries = state.entries;

  const getChildren = useCallback(
    (folderId) => Object.values(entries).filter((entry) => entry.parentId === folderId),
    [entries]
  );

  const currentFolderEntries = useMemo(
    () => getChildren(currentFolderId),
    [getChildren, currentFolderId]
  );

  const currentFolder = entries[currentFolderId];

  const createFile = (name = 'New document.md', folderId = currentFolderId) => {
    const entry = createEntry({ name, type: 'file', parentId: folderId ?? state.rootId });
    setState((prev) => ({
      ...prev,
      entries: { ...prev.entries, [entry.id]: entry }
    }));
    setSelectedEntryId(entry.id);
    return entry;
  };

  const createFolder = (name = 'New folder', folderId = currentFolderId) => {
    const entry = createEntry({ name, type: 'folder', parentId: folderId ?? state.rootId });
    setState((prev) => ({
      ...prev,
      entries: { ...prev.entries, [entry.id]: entry }
    }));
    setSelectedEntryId(entry.id);
    return entry;
  };

  const renameEntry = (id, name) => {
    setState((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [id]: {
          ...prev.entries[id],
          name,
          updatedAt: Date.now()
        }
      }
    }));
  };

  const deleteEntry = (id) => {
    setState((prev) => ({
      ...prev,
      entries: removeEntryTree(prev.entries, id)
    }));
    setSelectedEntryId((prev) => (prev === id ? null : prev));
    setActiveFileId((prev) => (prev === id ? null : prev));
  };

  const duplicate = (id) => {
    setState((prev) => ({
      ...prev,
      entries: duplicateEntry(prev.entries, id)
    }));
  };

  const updateFileContent = (id, content) => {
    setState((prev) => ({
      ...prev,
      entries: {
        ...prev.entries,
        [id]: {
          ...prev.entries[id],
          content,
          updatedAt: Date.now()
        }
      }
    }));
  };

  const setFolder = (folderId) => {
    setCurrentFolderId(folderId ?? state.rootId);
  };

  const value = {
    entries,
    rootId: state.rootId,
    currentFolderId,
    currentFolder,
    currentFolderEntries,
    activeFileId,
    setActiveFileId,
    selectedEntryId,
    setSelectedEntryId,
    createFile,
    createFolder,
    renameEntry,
    deleteEntry,
    duplicate,
    setFolder,
    updateFileContent
  };

  return <FileSystemContext.Provider value={value}>{children}</FileSystemContext.Provider>;
};

export const useFileSystem = () => {
  const ctx = useContext(FileSystemContext);
  if (!ctx) throw new Error('useFileSystem must be used within FileSystemProvider');
  return ctx;
};
