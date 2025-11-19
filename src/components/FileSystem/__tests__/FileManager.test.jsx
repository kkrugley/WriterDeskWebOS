import { describe, it, expect, vi } from 'vitest';
import { fireEvent, render } from '@testing-library/react';
import FileManager from '../FileManager.jsx';
import { FileSystemProvider } from '../../../contexts/FileSystemContext.jsx';

const setup = (props = {}) => {
  const defaultProps = { onOpenFile: vi.fn() };
  const utils = render(
    <FileSystemProvider>
      <FileManager {...{ ...defaultProps, ...props }} />
    </FileSystemProvider>
  );
  const manager = utils.container.querySelector('[tabindex="0"]');
  return { ...utils, manager, props: { ...defaultProps, ...props } };
};

describe('FileManager', () => {
  it('navigates entries with keyboard arrows and opens via Enter', () => {
    const onOpenFile = vi.fn();
    const { manager } = setup({ onOpenFile });

    fireEvent.keyDown(manager, { key: 'ArrowDown' });
    fireEvent.keyDown(manager, { key: 'Enter' });

    expect(onOpenFile).toHaveBeenCalledTimes(1);
    expect(onOpenFile.mock.calls[0][0]).toHaveProperty('name');
  });

  it('deletes selected entry with Delete key', () => {
    const { manager } = setup();

    fireEvent.keyDown(manager, { key: 'ArrowDown' });
    fireEvent.keyDown(manager, { key: 'Delete' });

    expect(manager.textContent).not.toContain('Welcome.md');
  });
});
