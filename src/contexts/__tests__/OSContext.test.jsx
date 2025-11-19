import { describe, it, expect } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { OSProvider, useOS } from '../OSContext.jsx';

const wrapper = ({ children }) => <OSProvider>{children}</OSProvider>;

describe('OSProvider', () => {
  it('toggles status bars and updates settings', () => {
    const { result } = renderHook(() => useOS(), { wrapper });

    act(() => {
      result.current.toggleStatusBars();
      result.current.updateSetting('fontSize', 22);
    });

    expect(result.current.statusBarsVisible).toBe(false);
    expect(result.current.settings.fontSize).toBe(22);
  });

  it('closes modals by priority', () => {
    const { result } = renderHook(() => useOS(), { wrapper });

    act(() => {
      result.current.openModal('manual');
      result.current.openModal('help');
    });

    expect(result.current.modals.help).toBe(true);
    expect(result.current.modals.manual).toBe(true);

    act(() => {
      result.current.closeTopModal();
    });

    expect(result.current.modals.help).toBe(false);
    expect(result.current.modals.manual).toBe(true);
  });
});
