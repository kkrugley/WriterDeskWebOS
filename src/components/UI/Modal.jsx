import { useEffect } from 'react';
import { createPortal } from 'react-dom';

const Modal = ({ title, children, onClose, footer }) => {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose?.();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl border-4 border-ink bg-paper text-ink shadow-xl">
        <header className="border-b-2 border-ink px-4 py-2 flex items-center justify-between">
          <h2 className="font-bold tracking-widest">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-sm uppercase tracking-widest hover:underline"
          >
            Close
          </button>
        </header>
        <section className="p-4 max-h-[70vh] overflow-y-auto text-sm leading-relaxed">
          {children}
        </section>
        {footer && <footer className="border-t-2 border-ink p-3">{footer}</footer>}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
