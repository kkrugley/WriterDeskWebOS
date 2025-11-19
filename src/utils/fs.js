const STORAGE_KEY = 'writerdesk_fs';

const defaultEntries = () => {
  const now = Date.now();
  return {
    root: {
      id: 'root',
      name: 'Documents',
      type: 'folder',
      parentId: null,
      createdAt: now,
      updatedAt: now
    },
    welcome: {
      id: 'welcome',
      name: 'Welcome.md',
      type: 'file',
      parentId: 'root',
      createdAt: now,
      updatedAt: now,
      content: '# Welcome to WriterDesk\n\nEverything you write stays on this device.'
    }
  };
};

const defaultState = () => ({
  entries: defaultEntries(),
  rootId: 'root'
});

export const generateId = () => {
  if (globalThis.crypto?.randomUUID) return globalThis.crypto.randomUUID();
  return `fs_${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

export const loadFileSystem = () => {
  if (typeof window === 'undefined') return defaultState();
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return defaultState();
    const parsed = JSON.parse(stored);
    return parsed.entries ? parsed : { ...defaultState(), ...parsed };
  } catch (error) {
    console.warn('Failed to parse FS', error);
    return defaultState();
  }
};

export const persistFileSystem = (state) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

export const removeEntryTree = (entries, id) => {
  const clone = { ...entries };
  const deleteRecursive = (targetId) => {
    Object.values(clone).forEach((entry) => {
      if (entry.parentId === targetId) {
        deleteRecursive(entry.id);
      }
    });
    delete clone[targetId];
  };
  deleteRecursive(id);
  return clone;
};

export const duplicateEntry = (entries, id, parentId) => {
  const original = entries[id];
  if (!original) return entries;
  const newEntries = { ...entries };
  const newId = generateId();
  newEntries[newId] = {
    ...original,
    id: newId,
    name: `${original.name.replace(/( copy \d+)?$/i, '')} copy`,
    parentId: parentId ?? original.parentId,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  return newEntries;
};

export const createEntry = ({ name, type, parentId }) => ({
  id: generateId(),
  name,
  type,
  parentId,
  createdAt: Date.now(),
  updatedAt: Date.now(),
  content: type === 'file' ? '' : undefined
});
