import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { FileSystemProvider, useFileSystem } from '../FileSystemContext.jsx';

const wrapper = ({ children }) => <FileSystemProvider>{children}</FileSystemProvider>;

describe('FileSystemProvider', () => {
  it('creates a new file inside the current folder and selects it', () => {
    const { result } = renderHook(() => useFileSystem(), { wrapper });

    let newEntry;
    act(() => {
      newEntry = result.current.createFile('spec.md');
    });

    expect(result.current.entries[newEntry.id]).toMatchObject({ name: 'spec.md', type: 'file' });
    expect(result.current.selectedEntryId).toBe(newEntry.id);
  });

  it('updates file content and marks file as active', () => {
    const { result } = renderHook(() => useFileSystem(), { wrapper });
    const initialFile = Object.values(result.current.entries).find((entry) => entry.type === 'file');
    act(() => {
      result.current.setActiveFileId(initialFile.id);
      result.current.updateFileContent(initialFile.id, 'Updated text');
    });

    expect(result.current.entries[initialFile.id].content).toBe('Updated text');
    expect(result.current.activeFileId).toBe(initialFile.id);
  });

  it('removes entries recursively and clears selection', () => {
    const { result } = renderHook(() => useFileSystem(), { wrapper });
    let target;
    act(() => {
      target = result.current.createFile('temporary.md');
      result.current.setSelectedEntryId(target.id);
      result.current.deleteEntry(target.id);
    });

    expect(result.current.entries[target.id]).toBeUndefined();
    expect(result.current.selectedEntryId).toBeNull();
  });
});
