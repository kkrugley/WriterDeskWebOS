import Modal from '../UI/Modal.jsx';

const manualSections = [
  {
    title: 'Markdown essentials',
    items: [
      ['# H1', 'Top level heading'],
      ['## H2', 'Section heading'],
      ['**bold**', 'Emphasis'],
      ['*italic*', 'Secondary emphasis'],
      ['`code`', 'Inline code'],
      ['> quote', 'Block quotes'],
      ['- item', 'Lists'],
      ['``` ```', 'Code fences']
    ]
  },
  {
    title: 'Device navigation',
    items: [
      ['Ctrl + F', 'Find inside document'],
      ['Ctrl + H', 'Find and replace'],
      ['Ctrl + J', 'Justify paragraph'],
      ['Ctrl + M', 'Indent paragraph'],
      ['Ctrl + Shift + Space', 'Non-breaking space']
    ]
  }
];

const ManualModal = ({ onClose }) => (
  <Modal title="OFFLINE MANUAL" onClose={onClose}>
    <div className="space-y-6 text-sm">
      {manualSections.map((section) => (
        <section key={section.title}>
          <h3 className="font-bold tracking-widest mb-2">{section.title}</h3>
          <div className="space-y-1">
            {section.items.map(([syntax, desc]) => (
              <div key={syntax} className="flex justify-between border-b border-dashed border-ink/30">
                <span className="font-bold">{syntax}</span>
                <span>{desc}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </div>
  </Modal>
);

export default ManualModal;
