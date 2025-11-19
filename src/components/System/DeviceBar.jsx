import { BatteryFull, ChevronLeft, Keyboard } from 'lucide-react';

const DeviceBar = ({ fileName, time, battery, layout, capsLock, onBack, view }) => {
  const isMobile = typeof window !== 'undefined' ? window.matchMedia('(max-width: 640px)').matches : false;
  const isEditor = view === 'editor' && isMobile;

  return (
    <div className="h-12 border-b-4 border-ink bg-paper flex items-center px-4 gap-4 select-none">
      {isEditor ? (
        <>
          <button
            type="button"
            onClick={onBack}
            className="p-2 -ml-2"
            aria-label="Back to files"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="flex-1 text-center font-bold tracking-[0.2em] uppercase truncate">
            {fileName || 'Documents'}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-4 w-1/3">
            <span className="font-bold">{layout}</span>
            <span className={`font-bold ${capsLock ? 'text-ink' : 'text-gray-400'}`}>CAPS</span>
            <Keyboard size={16} />
          </div>
          <div className="flex-1 text-center font-bold tracking-[0.2em] uppercase truncate">
            {fileName || 'FILE MANAGER'}
          </div>
          <div className="flex items-center justify-end w-1/3 gap-4">
            <span>{time}</span>
            <span className="flex items-center gap-1">
              {battery}% <BatteryFull size={16} />
            </span>
          </div>
        </>
      )}
    </div>
  );
};

export default DeviceBar;
