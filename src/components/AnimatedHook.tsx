import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedHookProps {
  phase: 'idle' | 'hooking' | 'caught' | 'revealed';
  fishIndex?: number;
}

const FISH_DESIGNS = [
  { name: 'Clownfish', emoji: '🐠', color: 'from-orange-500 to-amber-400' },
  { name: 'Blue Tang', emoji: '🐟', color: 'from-sky-500 to-blue-600' },
  { name: 'Golden Koi', emoji: '🐡', color: 'from-amber-400 to-yellow-300' },
  { name: 'Reef Wonder', emoji: '🐠', color: 'from-emerald-400 to-teal-500' },
  { name: 'Neon Tetra', emoji: '🐟', color: 'from-fuchsia-500 to-pink-500' },
  { name: 'Tropical Glow', emoji: '🐠', color: 'from-violet-500 to-cyan-400' },
];

export const AnimatedHook: React.FC<AnimatedHookProps> = ({ phase, fishIndex = 0 }) => {
  if (phase === 'idle') return null;

  const fish = FISH_DESIGNS[fishIndex % FISH_DESIGNS.length];

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20 flex flex-col items-center">
      {/* Fishing line & Hook Motion Container */}
      <motion.div
        className="flex flex-col items-center w-full"
        initial={{ y: -450 }}
        animate={
          phase === 'hooking'
            ? {
                y: [ -450, 60, 40, -100 ],
                transition: {
                  duration: 2.1,
                  times: [0, 0.45, 0.75, 1],
                  ease: 'easeInOut',
                },
              }
            : { y: -250 }
        }
      >
        {/* Fishing Line (Gleaming transparent monofilament) */}
        <div className="w-[2.5px] h-72 bg-gradient-to-b from-slate-200 via-cyan-200 to-amber-200 shadow-[0_0_8px_rgba(255,255,255,0.8)]" />

        {/* Fishing Hook & Bait */}
        <div className="relative -mt-1 flex flex-col items-center">
          {/* Golden Hook SVG */}
          <svg width="44" height="60" viewBox="0 0 44 60" fill="none" className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
            <path
              d="M22 2 L22 36 C22 48 36 48 36 34 L36 26"
              stroke="#fbbf24"
              strokeWidth="4.5"
              strokeLinecap="round"
            />
            {/* Hook Barb */}
            <path d="M36 28 L30 33" stroke="#f59e0b" strokeWidth="3.5" strokeLinecap="round" />
            {/* Eyelet */}
            <circle cx="22" cy="5" r="3.5" fill="none" stroke="#fbbf24" strokeWidth="3" />
          </svg>

          {/* Glowing Hook light */}
          <div className="absolute top-8 w-6 h-6 rounded-full bg-cyan-400/40 blur-md animate-ping" />

          {/* Caught Fish attached to Hook during Phase 2 end / Phase 3 */}
          {(phase === 'hooking' || phase === 'caught') && (
            <motion.div
              className="absolute top-10 flex flex-col items-center"
              initial={{ scale: 0, opacity: 0 }}
              animate={{
                scale: [0, 0, 1.2, 1],
                opacity: [0, 0, 1, 1],
                rotate: [0, -15, 15, -5],
              }}
              transition={{ duration: 1.8, times: [0, 0.45, 0.75, 1] }}
            >
              <div className="text-6xl filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.6)] animate-bounce">
                {fish.emoji}
              </div>
              <div className="mt-1 px-3 py-0.5 rounded-full text-xs font-bold text-white bg-gradient-to-r from-cyan-600 to-blue-600 shadow-md">
                Gotcha!
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Dynamic Splash & Bubbles Eruption during hooking */}
      {phase === 'hooking' && (
        <motion.div
          className="absolute top-1/2 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{
            opacity: [0, 0.9, 1, 0],
            scale: [0.5, 1.3, 1.8, 2.2],
          }}
          transition={{ duration: 1.2, delay: 0.8 }}
        >
          <div className="w-48 h-48 rounded-full border-4 border-cyan-300/80 shadow-[0_0_35px_rgba(6,182,212,0.9)] animate-ping" />
          <div className="absolute text-3xl">💦</div>
        </motion.div>
      )}
    </div>
  );
};
