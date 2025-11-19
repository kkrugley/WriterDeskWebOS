import { describe, it, expect, vi } from 'vitest';
import { createRef } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TextEditor from '../TextEditor.jsx';

describe('TextEditor', () => {
  it('renders textarea and emits change/metrics events', () => {
    const handleChange = vi.fn();
    const handleMetrics = vi.fn();

    render(<TextEditor value="Hello" onChange={handleChange} onMetrics={handleMetrics} fontSize={18} />);

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Hello world' } });

    expect(handleChange).toHaveBeenCalledWith('Hello world');
    expect(handleMetrics).toHaveBeenCalled();
  });

  it('supports replaceAll via imperative ref', () => {
    const handleChange = vi.fn();
    const editorRef = createRef();

    render(<TextEditor ref={editorRef} value="Hello world" onChange={handleChange} onMetrics={() => {}} fontSize={18} />);

    editorRef.current.replaceAll('world', 'Writer');

    expect(handleChange).toHaveBeenCalledWith('Hello Writer');
  });
});
