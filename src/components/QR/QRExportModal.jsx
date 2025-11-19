import { useEffect, useState } from 'react';
import QRCode from 'react-qr-code';
import Modal from '../UI/Modal.jsx';
import { useQRStream } from '../../hooks/useQRStream.js';
import { PROTOCOL_CONSTANTS } from '../../utils/protocol.js';

const QRExportModal = ({ content, fileName, onClose }) => {
  const { frames, hash, total } = useQRStream(content || '');
  const [index, setIndex] = useState(0);

  useEffect(() => {
    setIndex(0);
    if (!frames.length) return;
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % frames.length);
    }, PROTOCOL_CONSTANTS.FRAME_INTERVAL_MS);
    return () => clearInterval(interval);
  }, [frames]);

  return (
    <Modal title="QR EXPORT" onClose={onClose}>
      <div className="flex flex-col items-center gap-4">
        {frames.length > 0 ? (
          <QRCode value={frames[index]} size={256} fgColor="#111111" bgColor="#F5F5F5" />
        ) : (
          <span>Preparing frames...</span>
        )}
        <div className="text-xs uppercase tracking-widest">
          Frame {index + 1}/{total} · Hash {hash?.slice(0, 8)}
        </div>
        <div className="text-[10px] text-gray-500">{fileName}</div>
      </div>
    </Modal>
  );
};

export default QRExportModal;
