import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Modal from '../Modal.jsx';

describe('Modal', () => {
  it('closes when Escape is pressed', () => {
    const handleClose = vi.fn();
    render(
      <Modal title="Test" onClose={handleClose}>
        Content
      </Modal>
    );

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(handleClose).toHaveBeenCalled();
  });

  it('renders provided children', () => {
    render(
      <Modal title="Test" onClose={() => {}}>
        <p>Body</p>
      </Modal>
    );
    expect(screen.getByText('Body')).toBeInTheDocument();
  });
});
