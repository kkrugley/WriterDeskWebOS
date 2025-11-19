import FileItem from './FileItem.jsx';

const headers = ['Name', 'Type', 'Updated', 'Size'];

const FileList = ({ entries, selectedId, onOpen, onSelect }) => (
  <div className="h-full flex flex-col border-2 border-ink/40 bg-white">
    <div className="grid grid-cols-[3fr,1fr,1.5fr,1fr] text-[10px] uppercase tracking-[0.3em] px-4 py-2 bg-ink/5 border-b border-ink/20">
      {headers.map((header) => (
        <span key={header}>{header}</span>
      ))}
    </div>
    <div className="flex-1 overflow-y-auto divide-y divide-ink/15">
      {entries.length === 0 ? (
        <div className="px-4 py-6 text-center text-gray-400 tracking-widest text-xs">DIRECTORY EMPTY</div>
      ) : (
        entries.map((entry) => (
          <FileItem
            key={entry.id}
            entry={entry}
            isSelected={selectedId === entry.id}
            onOpen={onOpen}
            onSelect={onSelect}
          />
        ))
      )}
    </div>
  </div>
);

export default FileList;
