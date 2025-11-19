import Modal from '../UI/Modal.jsx';

const helpSections = [
  {
    title: 'Function keys',
    items: [
      ['F1', 'Help window'],
      ['F2', 'Rename entry'],
      ['F3', 'Create file'],
      ['F4', 'Create folder'],
      ['F5', 'Refresh view'],
      ['F6', 'Transfer (QR)'],
      ['F7', 'System settings'],
      ['F10', 'Document info']
    ]
  },
  {
    title: 'Editor control',
    items: [
      ['Ctrl + S', 'Save current file'],
      ['Ctrl + N', 'New file'],
      ['Ctrl + Shift + N', 'New folder'],
      ['Ctrl + Q', 'Exit editor'],
      ['Esc', 'Close modal / Exit editor'],
      ['Alt + H', 'Toggle status bars'],
      ['Alt + M', 'Open manual']
    ]
  }
];

const HelpModal = ({ onClose }) => (
  <Modal title="SYSTEM HELP" onClose={onClose}>
    <div className="space-y-6 text-sm">
      {helpSections.map((section) => (
        <section key={section.title}>
          <h3 className="font-bold tracking-widest mb-2">{section.title}</h3>
          <div className="space-y-1">
            {section.items.map(([combo, desc]) => (
              <div key={combo} className="flex justify-between border-b border-dashed border-ink/30 pb-1">
                <span className="font-bold">{combo}</span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </Modal>
);

export default HelpModal;
