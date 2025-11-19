import Modal from '../UI/Modal.jsx';

const InfoRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-dashed border-ink/30 py-1">
    <span>{label}</span>
    <span className="font-bold">{value}</span>
  </div>
);

const InfoModal = ({ file, metrics, onClose }) => (
  <Modal title="DOCUMENT INFO" onClose={onClose}>
    <div className="space-y-6">
      <section>
        <h3 className="font-bold tracking-widest mb-2">FILE</h3>
        <InfoRow label="Name" value={file?.name || 'Untitled'} />
        <InfoRow label="Size" value={`${((file?.content?.length || 0) / 1024).toFixed(2)} KiB`} />
        <InfoRow
          label="Updated"
          value={file?.updatedAt ? new Date(file.updatedAt).toLocaleString() : 'N/A'}
        />
      </section>
      <section>
        <h3 className="font-bold tracking-widest mb-2">STATISTICS</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <InfoRow label="Words" value={metrics.words} />
          <InfoRow label="Characters (w/spaces)" value={metrics.charsWithSpaces} />
          <InfoRow label="Characters" value={metrics.charsNoSpaces} />
          <InfoRow label="Sentences" value={metrics.sentences} />
          <InfoRow label="Paragraphs" value={metrics.paragraphs} />
          <InfoRow label="Lines" value={metrics.lines} />
          <InfoRow label="Empty Lines" value={metrics.emptyLines} />
          <InfoRow label="Unique Words" value={metrics.uniqueWords} />
          <InfoRow label="Average sentence" value={`${metrics.avgSentenceLength} words`} />
          <InfoRow label="Average word" value={`${metrics.avgWordLength} chars`} />
          <InfoRow label="Reading time" value={metrics.readTime} />
          <InfoRow label="Flesch score" value={metrics.flesch} />
        </div>
      </section>
    </div>
  </Modal>
);

export default InfoModal;
