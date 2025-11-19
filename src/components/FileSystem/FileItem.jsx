import { Folder, FileText } from 'lucide-react';
import clsx from 'clsx';

const FileItem = ({ entry, isSelected, onOpen, onSelect }) => {
  const icon = entry.type === 'folder' ? <Folder size={18} /> : <FileText size={18} />;
  const size = entry.type === 'file' ? `${((entry.content?.length || 0) / 1024).toFixed(2)} KiB` : '—';

  return (
    <div
      tabIndex={-1}
      onDoubleClick={() => onOpen(entry)}
      onClick={() => onSelect(entry.id)}
      className={clsx(
        'grid grid-cols-[3fr,1fr,1.5fr,1fr] items-center gap-4 px-4 py-3 cursor-pointer transition-colors',
        isSelected ? 'bg-ink text-paper' : 'hover:bg-ink/10'
      )}
    >
      <div className="flex items-center gap-3 min-w-0">
        {icon}
        <span className="truncate text-sm font-semibold">{entry.name}</span>
      </div>
      <span className="text-xs tracking-widest uppercase">{entry.type}</span>
      <span className="text-xs truncate">{new Date(entry.updatedAt).toLocaleString()}</span>
      <div className="flex items-center justify-end gap-2 text-xs">{size}</div>
    </div>
  );
};

export default FileItem;
