import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

// Deadline: 11:00 PM on 12th October 2026 (Month is 0-indexed: 9 = October)
export const SUBMISSION_DEADLINE = new Date(2026, 9, 12, 23, 0, 0);

interface TimeRemaining {
  total: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isExpired: boolean;
}

function calculateTimeRemaining(): TimeRemaining {
  const total = SUBMISSION_DEADLINE.getTime() - Date.now();
  if (total <= 0) {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true };
  }
  const seconds = Math.floor((total / 1000) % 60);
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const hours = Math.floor((total / (1000 * 60 * 60)) % 24);
  const days = Math.floor(total / (1000 * 60 * 60 * 24));
  return { total, days, hours, minutes, seconds, isExpired: false };
}

interface SubmissionCountdownProps {
  onExpiredChange?: (isExpired: boolean) => void;
}

export const SubmissionCountdown: React.FC<SubmissionCountdownProps> = ({ onExpiredChange }) => {
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining);

  useEffect(() => {
    const updateTimer = () => {
      const remaining = calculateTimeRemaining();
      setTimeLeft(remaining);
      if (onExpiredChange) {
        onExpiredChange(remaining.isExpired);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [onExpiredChange]);

  const pad = (num: number) => String(num).padStart(2, '0');

  if (timeLeft.isExpired) {
    return (
      <div className="mb-6 p-4 rounded-2xl bg-rose-500/15 border border-rose-500/40 text-rose-200 flex items-center justify-center gap-3 text-center shadow-lg">
        <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0" />
        <div>
          <span className="font-bold block text-sm sm:text-base text-rose-300">
            Submissions are now closed!
          </span>
          <span className="text-xs text-rose-200/80">
            The deadline of 11:00 PM on 12th October 2026 has passed. The pond is being prepared!
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 p-4 sm:p-5 rounded-2xl glass-panel border border-cyan-400/30 text-center relative overflow-hidden shadow-[0_0_30px_rgba(6,182,212,0.15)]">
      {/* Background soft glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with clock icon */}
      <div className="flex items-center justify-center gap-2 mb-3">
        <Clock className="w-4 h-4 text-cyan-400 animate-pulse" />
        <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-cyan-300">
          Submissions Close In
        </span>
      </div>

      {/* Countdown Digits Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-3 max-w-sm mx-auto">
        {/* Days */}
        <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 shadow-inner">
          <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-white tracking-tight">
            {pad(timeLeft.days)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mt-0.5">
            Days
          </span>
        </div>

        {/* Hours */}
        <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 shadow-inner">
          <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-cyan-300 tracking-tight">
            {pad(timeLeft.hours)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mt-0.5">
            Hours
          </span>
        </div>

        {/* Minutes */}
        <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-cyan-500/20 shadow-inner">
          <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-teal-300 tracking-tight">
            {pad(timeLeft.minutes)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mt-0.5">
            Mins
          </span>
        </div>

        {/* Seconds */}
        <div className="flex flex-col items-center p-2 sm:p-2.5 rounded-xl bg-slate-900/70 border border-amber-500/30 shadow-inner">
          <span className="text-xl sm:text-2xl md:text-3xl font-black font-mono text-amber-300 tracking-tight animate-pulse">
            {pad(timeLeft.seconds)}
          </span>
          <span className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase mt-0.5">
            Secs
          </span>
        </div>
      </div>

      {/* Deadline Info Footer */}
      <p className="mt-3 text-[11px] sm:text-xs text-cyan-200/70 font-medium">
        Deadline: <span className="text-amber-300 font-semibold">12th October 2026, 11:00 PM</span>
      </p>
    </div>
  );
};
