import { useState } from 'react';
import Button from '../UI/Button.jsx';

const FindPanel = ({ visible, onClose, onSubmit }) => {
  const [find, setFind] = useState('');
  const [replace, setReplace] = useState('');

  if (!visible) return null;

  return (
    <div className="absolute bottom-4 right-4 border-2 border-ink bg-paper p-4 shadow-crt w-80 space-y-2 text-xs">
      <div className="flex justify-between items-center">
        <span className="font-bold tracking-widest">FIND / REPLACE</span>
        <button type="button" onClick={onClose} className="hover:underline">
          Close
        </button>
      </div>
      <label className="flex flex-col gap-1">
        <span>Find</span>
        <input
          value={find}
          onChange={(event) => setFind(event.target.value)}
          className="border border-ink px-2 py-1 bg-paper"
        />
      </label>
      <label className="flex flex-col gap-1">
        <span>Replace</span>
        <input
          value={replace}
          onChange={(event) => setReplace(event.target.value)}
          className="border border-ink px-2 py-1 bg-paper"
        />
      </label>
      <div className="flex gap-2">
        <Button
          onClick={() =>
            onSubmit?.({ find, replace, replaceAll: false })
          }
        >
          Find next
        </Button>
        <Button
          onClick={() =>
            onSubmit?.({ find, replace, replaceAll: true })
          }
        >
          Replace all
        </Button>
      </div>
    </div>
  );
};

export default FindPanel;
