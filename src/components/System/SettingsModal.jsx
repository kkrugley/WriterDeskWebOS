import Modal from '../UI/Modal.jsx';

const SettingsModal = ({ settings, onUpdate, onClose }) => (
  <Modal title="SYSTEM SETTINGS" onClose={onClose}>
    <div className="space-y-4 text-sm">
      <label className="flex items-center justify-between">
        <span>Auto save interval ({settings.autoSaveInterval}ms)</span>
        <input
          type="range"
          min="1000"
          max="10000"
          step="500"
          value={settings.autoSaveInterval}
          onChange={(event) => onUpdate('autoSaveInterval', Number(event.target.value))}
        />
      </label>
      <label className="flex items-center justify-between">
        <span>Font size ({settings.fontSize}px)</span>
        <input
          type="range"
          min="14"
          max="24"
          step="1"
          value={settings.fontSize}
          onChange={(event) => onUpdate('fontSize', Number(event.target.value))}
        />
      </label>
      <label className="flex items-center justify-between">
        <span>Autocorrect</span>
        <input
          type="checkbox"
          checked={settings.autoCorrect}
          onChange={(event) => onUpdate('autoCorrect', event.target.checked)}
        />
      </label>
    </div>
  </Modal>
);

export default SettingsModal;
