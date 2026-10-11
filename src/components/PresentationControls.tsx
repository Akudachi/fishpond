import React from 'react';
import { Maximize2, Minimize2, Volume2, VolumeX } from 'lucide-react';

interface PresentationControlsProps {
  soundEnabled: boolean;
  onToggleSound: () => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  className?: string;
}

export const PresentationControls: React.FC<PresentationControlsProps> = ({
  soundEnabled,
  onToggleSound,
  isFullscreen,
  onToggleFullscreen,
  className = '',
}) => {
  return (
    <div
      className={`flex items-center gap-2 p-1.5 rounded-2xl glass-panel shadow-lg border border-cyan-400/20 backdrop-blur-md ${className}`}
    >
      {/* Sound Toggle */}
      <button
        onClick={onToggleSound}
        title={soundEnabled ? 'Mute sound effects' : 'Unmute sound effects'}
        className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
          soundEnabled
            ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 border border-cyan-400/30'
            : 'bg-slate-800/60 text-slate-400 hover:bg-slate-800 border border-slate-700/50'
        }`}
      >
        {soundEnabled ? <Volume2 className="w-5 h-5 text-cyan-400" /> : <VolumeX className="w-5 h-5 text-rose-400" />}
        <span className="hidden sm:inline">{soundEnabled ? 'Sound ON' : 'Muted'}</span>
      </button>

      {/* Auditorium / Fullscreen Mode Toggle */}
      <button
        onClick={onToggleFullscreen}
        title={isFullscreen ? 'Exit Presentation Mode' : 'Enter Auditorium Presentation Mode'}
        className={`p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 text-xs font-semibold ${
          isFullscreen
            ? 'bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-400/40'
            : 'bg-slate-800/60 text-slate-200 hover:bg-slate-800 border border-slate-700/50'
        }`}
      >
        {isFullscreen ? <Minimize2 className="w-4 h-4 sm:w-5 sm:h-5 text-amber-300" /> : <Maximize2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />}
        <span className="hidden sm:inline">{isFullscreen ? 'Exit Fullscreen' : 'Projector Mode'}</span>
      </button>
    </div>
  );
};
