import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Sparkles, RotateCcw, User } from 'lucide-react';
import type { PublicApprovedChallenge } from '../types/challenge';

interface ChallengeRevealProps {
  challenge: PublicApprovedChallenge | null;
  isOpen: boolean;
  onNextFresher: () => void;
  isPresentationMode?: boolean;
}

export const ChallengeReveal: React.FC<ChallengeRevealProps> = ({
  challenge,
  isOpen,
  onNextFresher,
  isPresentationMode = false,
}) => {
  // Trigger celebratory confetti burst on reveal
  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 85,
          origin: { y: 0.6 },
          colors: ['#06b6d4', '#3b82f6', '#f59e0b', '#ec4899', '#10b981'],
        });

        const timer = setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 60,
            origin: { x: 0 },
            colors: ['#38bdf8', '#fbbf24', '#a855f7'],
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 60,
            origin: { x: 1 },
            colors: ['#38bdf8', '#fbbf24', '#a855f7'],
          });
        }, 300);

        return () => clearTimeout(timer);
      } catch {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !challenge) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-slate-950/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className={`w-full ${
            isPresentationMode ? 'max-w-5xl' : 'max-w-3xl'
          } rounded-3xl p-6 md:p-12 relative overflow-hidden text-center projector-card border-2 border-cyan-400/60 bg-gradient-to-b from-[#0a2347] via-[#051833] to-[#030e1f] shadow-[0_0_80px_rgba(6,182,212,0.45)]`}
        >
          {/* Animated decorative water light caustics */}
          <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Catch Header Badge */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring' }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-sm md:text-base tracking-wider uppercase mb-6 shadow-inner"
          >
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
            <span>🎉 FISH CAUGHT! CHALLENGE REVEALED</span>
            <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
          </motion.div>

          {/* Submitter Name Badge */}
          <div className="flex items-center justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm md:text-base font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40 shadow-md">
              <User className="w-4 h-4 text-amber-300" />
              <span>Submitted by: {challenge.student_name || 'Fresher'}</span>
            </span>
          </div>

          {/* Main Challenge Text — Large & High Contrast for Projector / Auditorium */}
          <div className="my-6 md:my-10 px-2 md:px-8">
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className={`font-black text-white leading-tight tracking-tight drop-shadow-lg projector-title ${
                isPresentationMode
                  ? 'text-4xl md:text-6xl lg:text-7xl font-extrabold'
                  : 'text-2xl md:text-4xl lg:text-5xl font-extrabold'
              }`}
            >
              "{challenge.challenge_text}"
            </motion.p>
          </div>

          {/* Action Button: Next Fresher Catch Again */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={onNextFresher}
              className="w-full sm:w-auto px-8 md:px-12 py-4 md:py-5 rounded-2xl font-black text-lg md:text-2xl text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 transition-all transform hover:scale-105 active:scale-95 shadow-[0_0_35px_rgba(6,182,212,0.6)] cursor-pointer flex items-center justify-center gap-3"
            >
              <RotateCcw className="w-6 h-6 md:w-7 md:h-7 stroke-[2.5]" />
              <span>NEXT FRESHER — CATCH AGAIN</span>
              <span className="text-2xl">🎣</span>
            </button>
          </motion.div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
