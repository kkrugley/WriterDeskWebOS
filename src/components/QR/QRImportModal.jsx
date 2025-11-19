import { useEffect, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import Modal from '../UI/Modal.jsx';
import { useQRFrameCollector } from '../../hooks/useQRStream.js';

const QRImportModal = ({ onImport, onClose }) => {
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const { progress, submitFrame, reset } = useQRFrameCollector({
    onComplete: (text) => {
      onImport(text);
      reset();
      onClose();
    },
    onError: (err) => setError(err.message)
  });

  useEffect(() => () => reset(), [reset]);

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;
    let isMounted = true;
    const elementId = 'qr-reader';
    const scanner = new Html5Qrcode(elementId);
    const config = {
      fps: 12,
      qrbox: window.innerWidth < 640 ? { width: 220, height: 220 } : { width: 300, height: 300 },
      aspectRatio: window.innerWidth < 640 ? 1 : 1.3,
      disableFlip: true
    };
    scanner
      .start(
        { facingMode: { ideal: 'environment' } },
        config,
        (decoded) => {
          if (!isMounted) return;
          setError(null);
          submitFrame(decoded);
        },
        (scanError) => {
          if (!isMounted) return;
          if (typeof scanError === 'string' && scanError.includes('NotFoundException')) return;
          setError('Hold steady and keep the QR code within the frame.');
        }
      )
      .then(() => {
        if (isMounted) setCameraReady(true);
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err?.message || 'Camera access denied. Please allow camera permissions.');
      });

    return () => {
      isMounted = false;
      scanner
        .stop()
        .catch(() => null)
        .finally(() => {
          scanner.clear();
        });
    };
  }, [submitFrame]);

  return (
    <Modal title="QR IMPORT" onClose={onClose}>
      <div className="space-y-4">
        <div id="qr-reader" className="w-full h-64 border-2 border-ink bg-black/60" />
        <div className="text-xs uppercase tracking-widest">
          {cameraReady ? 'Camera ready — align the WriterDesk display within the frame.' : 'Requesting camera access...'}
        </div>
        <div className="text-xs uppercase tracking-widest">
          Packets {progress.received}/{progress.total || '?'}
        </div>
        <div className="h-2 bg-gray-200">
          <div
            className="h-full bg-ink"
            style={{ width: progress.total ? `${(progress.received / progress.total) * 100}%` : '0%' }}
          />
        </div>
        {error && <div className="text-red-600 text-xs">{error}</div>}
      </div>
    </Modal>
  );
};

export default QRImportModal;
