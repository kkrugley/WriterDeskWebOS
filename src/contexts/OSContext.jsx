import { createContext, useContext, useMemo, useState } from 'react';

const initialModals = {
  help: false,
  settings: false,
  info: false,
  manual: false,
  qrExport: false,
  qrImport: false
};

const initialSettings = {
  autoSaveInterval: 2000,
  autoCorrect: false,
  fontSize: 18
};

const modalPriority = ['help', 'manual', 'settings', 'info', 'qrExport', 'qrImport'];

const OSContext = createContext(undefined);

export const OSProvider = ({ children }) => {
  const [view, setView] = useState('files');
  const [statusBarsVisible, setStatusBarsVisible] = useState(true);
  const [layout, setLayout] = useState('EN');
  const [capsLock, setCapsLock] = useState(false);
  const [modals, setModals] = useState(initialModals);
  const [settings, setSettings] = useState(initialSettings);

  const openModal = (name) => setModals((prev) => ({ ...prev, [name]: true }));
  const closeModal = (name) => setModals((prev) => ({ ...prev, [name]: false }));

  const closeTopModal = () => {
    const target = modalPriority.find((key) => modals[key]);
    if (target) {
      closeModal(target);
      return true;
    }
    return false;
  };

  const toggleStatusBars = () => setStatusBarsVisible((prev) => !prev);

  const updateSetting = (key, value) => setSettings((prev) => ({ ...prev, [key]: value }));

  const value = useMemo(
    () => ({
      view,
      setView,
      statusBarsVisible,
      toggleStatusBars,
      layout,
      setLayout,
      capsLock,
      setCapsLock,
      modals,
      openModal,
      closeModal,
      closeTopModal,
      settings,
      updateSetting
    }),
    [view, statusBarsVisible, layout, capsLock, modals, settings]
  );

  return <OSContext.Provider value={value}>{children}</OSContext.Provider>;
};

export const useOS = () => {
  const ctx = useContext(OSContext);
  if (!ctx) throw new Error('useOS must be used within OSProvider');
  return ctx;
};
