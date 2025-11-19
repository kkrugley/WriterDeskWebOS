const shortcuts = [
  { label: 'F1', action: 'HELP' },
  { label: 'F2', action: 'RENAME' },
  { label: 'F3', action: 'NEW FILE' },
  { label: 'F4', action: 'NEW FOLDER' },
  { label: 'F6', action: 'TRANSFER' },
  { label: 'F7', action: 'SETTINGS' }
];

const ShortcutBar = () => (
  <div className="h-12 border-t-4 border-ink bg-paper flex items-center justify-between px-6 text-[11px] uppercase tracking-[0.3em] whitespace-nowrap">
    {shortcuts.map((hint) => (
      <span key={hint.label} className="flex items-center gap-2 whitespace-nowrap">
        <span className="font-bold">{hint.label}</span>
        <span className="text-[10px] tracking-widest opacity-80">{hint.action}</span>
      </span>
    ))}
  </div>
);

export default ShortcutBar;
