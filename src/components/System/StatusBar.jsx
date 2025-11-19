const formatCursor = (value = '1:1') => {
  const [line = '1', column = '1'] = value.split(':');
  return `L${line}:R${column}`;
};

const StatusBar = ({ status, cursor, words, size }) => (
  <div className="h-12 border-t-4 border-ink bg-paper flex items-center justify-between px-6 text-sm select-none uppercase tracking-widest">
    <div className="flex items-center gap-4">
      <span>{status === 'saved' ? '✓' : '*'}</span>
      <span>{formatCursor(cursor)}</span>
    </div>
    <div className="flex items-center gap-4 text-xs">
      <span className="whitespace-nowrap">WORDS {words ?? 0}</span>
      <span className="opacity-50">|</span>
      <span className="whitespace-nowrap">{size || '0 KiB'}</span>
    </div>
  </div>
);

export default StatusBar;
