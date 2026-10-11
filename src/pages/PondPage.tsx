import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Fish, Sparkles, AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FishPondCanvas } from '../components/FishPondCanvas';
import { AnimatedHook } from '../components/AnimatedHook';
import { ChallengeReveal } from '../components/ChallengeReveal';
import { PresentationControls } from '../components/PresentationControls';
import { useFishPond } from '../hooks/useFishPond';
import { useEventSettings } from '../hooks/useChallenges';

export const PondPage: React.FC = () => {
  const {
    phase,
    approvedChallenges,
    currentChallenge,
    isLoadingPool,
    error,
    soundEnabled,
    targetFishIndex,
    catchFish,
    resetRound,
    toggleSound,
    refreshPool,
  } = useFishPond();

  const { settings } = useEventSettings();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Toggle Auditorium Presentation Mode
  const handleToggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
          setIsFullscreen(true);
        } else {
          setIsFullscreen(!isFullscreen);
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
          setIsFullscreen(false);
        } else {
          setIsFullscreen(false);
        }
      }
    } catch {
      // Fallback: virtual fullscreen toggle
      setIsFullscreen(!isFullscreen);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.key === ' ') {
        if (phase === 'idle') {
          e.preventDefault();
          catchFish();
        } else if (phase === 'revealed') {
          e.preventDefault();
          resetRound();
        }
      } else if (e.key === 'Escape') {
        if (phase === 'revealed') {
          resetRound();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [phase, catchFish, resetRound]);

  const hasApprovedChallenges = approvedChallenges.length >= (settings.min_approved_required || 1);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-[100dvh] overflow-hidden bg-[#020e21] text-white select-none flex flex-col justify-between ${
        isFullscreen ? 'p-0 cursor-default' : ''
      }`}
    >
      {/* 1. Interactive Canvas Simulation Layer */}
      <div className="absolute inset-0 z-0">
        <FishPondCanvas isHooking={phase === 'hooking'} />
      </div>

      {/* 2. Physics Animated Hook & Splash Layer */}
      <AnimatedHook phase={phase} fishIndex={targetFishIndex} />

      {/* 3. Top Navigation & Auditorium Bar */}
      <header className="relative z-30 w-full px-3 sm:px-6 md:px-8 py-3 sm:py-5 flex items-center justify-between gap-2">
        {/* Back Link */}
        {!isFullscreen ? (
          <Link
            to="/"
            className="flex items-center gap-1.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl glass-panel text-xs sm:text-sm font-semibold text-slate-200 hover:text-cyan-300 hover:bg-slate-800/80 transition-all border border-cyan-400/20 shrink-0"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
            <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-cyan-300/80 hidden xs:inline">
              Auditorium Mode
            </span>
          </div>
        )}

        {/* Live Pool Count Indicator & Controls */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="px-2.5 sm:px-3.5 py-1.5 rounded-full glass-panel border border-cyan-400/30 text-[11px] sm:text-xs font-bold text-cyan-300 flex items-center gap-1.5">
            <Fish className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-cyan-400 shrink-0" />
            <span>
              {approvedChallenges.length} <span className="hidden xs:inline">In Pond</span>
            </span>
          </div>

          {/* Presentation and Sound Controls */}
          <PresentationControls
            soundEnabled={soundEnabled}
            onToggleSound={toggleSound}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
          />
        </div>
      </header>

      {/* 4. Center Game Action Area */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-2 text-center max-w-5xl mx-auto w-full">
        {/* Main Title & Subtitle */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-3 sm:mb-8 w-full"
        >
          <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 rounded-full glass-panel border border-cyan-400/30 text-cyan-300 font-bold text-[10px] sm:text-xs uppercase tracking-widest mb-2 sm:mb-3 shadow-[0_0_20px_rgba(6,182,212,0.3)]">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
            <span className="truncate max-w-[200px] sm:max-w-none">{settings.college_name || 'COLLEGE FRESHERS 2026'}</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-spin" />
          </div>

          <h1
            className={`font-black uppercase tracking-tight text-white projector-title break-words px-2 ${
              isFullscreen 
                ? 'text-3xl sm:text-6xl md:text-7xl lg:text-8xl leading-none' 
                : 'text-2xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight'
            }`}
          >
            {settings.event_title || 'FRESHERS FISH POND'}
          </h1>

          <p
            className={`text-cyan-200/90 font-medium max-w-xl mx-auto drop-shadow-md px-2 ${
              isFullscreen ? 'text-sm sm:text-xl md:text-2xl mt-2 sm:mt-3' : 'text-xs sm:text-base md:text-lg mt-1.5 sm:mt-2'
            }`}
          >
            {settings.subtitle || 'Ready to discover your challenge? Step up and cast your line!'}
          </p>
        </motion.div>

        {/* Dynamic Action Zone */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-4 p-3 sm:p-4 max-w-lg rounded-2xl glass-panel-glow border border-amber-400/40 text-amber-200 flex items-center gap-2.5 text-xs sm:text-sm"
          >
            <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}

        {!hasApprovedChallenges && !isLoadingPool ? (
          /* Empty Pool State */
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 sm:p-8 rounded-3xl glass-panel-glow border-2 border-amber-400/40 max-w-lg shadow-[0_0_40px_rgba(245,158,11,0.2)] text-center mx-4"
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-3 sm:mb-4 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center">
              <Fish className="w-6 h-6 sm:w-8 sm:h-8 text-amber-300" />
            </div>
            <h3 className="text-lg sm:text-2xl font-black text-white mb-2">
              THE POND IS WAITING FOR FISH!
            </h3>
            <p className="text-slate-300 text-xs sm:text-sm mb-5 leading-relaxed">
              Ask the admin to approve some challenges before playing. New submissions must be verified first.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5">
              <Link
                to="/submit"
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-cyan-400 text-slate-950 hover:bg-cyan-300 transition-all cursor-pointer"
              >
                Submit A Dare
              </Link>
              <button
                onClick={refreshPool}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs bg-slate-800 text-slate-200 hover:bg-slate-700 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Check Again</span>
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main Interactive Catch A Fish Button */
          <div className="relative mt-2 sm:mt-4 w-full sm:w-auto flex flex-col items-center">
            <motion.button
              onClick={catchFish}
              disabled={phase !== 'idle' || !hasApprovedChallenges}
              whileHover={{ scale: phase === 'idle' ? 1.05 : 1 }}
              whileTap={{ scale: phase === 'idle' ? 0.95 : 1 }}
              className={`relative w-full sm:w-auto px-8 sm:px-14 py-4 sm:py-6 rounded-2xl sm:rounded-3xl font-black text-lg sm:text-2xl md:text-3xl tracking-wide transition-all cursor-pointer shadow-[0_0_40px_rgba(6,182,212,0.6)] ${
                phase === 'idle'
                  ? 'text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 animate-pulse-glow'
                  : 'text-slate-400 bg-slate-800/80 border border-slate-700 cursor-not-allowed opacity-80'
              }`}
            >
              {phase === 'idle' && (
                <span className="flex items-center justify-center gap-2.5 sm:gap-3">
                  <span>CATCH A FISH</span>
                  <span className="text-2xl sm:text-3xl md:text-4xl">🎣</span>
                </span>
              )}

              {phase === 'hooking' && (
                <span className="flex items-center justify-center gap-2.5 text-cyan-300 text-base sm:text-xl">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 border-3 border-cyan-300 border-t-transparent rounded-full animate-spin" />
                  <span>REELING IN YOUR DARE...</span>
                </span>
              )}

              {phase === 'caught' && (
                <span className="flex items-center justify-center gap-2 text-amber-300 text-base sm:text-xl">
                  <span className="text-2xl animate-bounce">🎉</span>
                  <span>FISH CAUGHT!</span>
                </span>
              )}

              {phase === 'revealed' && (
                <span className="flex items-center justify-center gap-2 text-emerald-300 text-base sm:text-xl">
                  <span>CHALLENGE ACTIVE</span>
                </span>
              )}
            </motion.button>

            {/* Subtle floating hint */}
            {phase === 'idle' && (
              <p className="mt-3 text-[11px] sm:text-xs text-cyan-200/70 font-semibold tracking-wide">
                Tip: Tap button or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">SPACE</kbd>
              </p>
            )}
          </div>
        )}
      </main>

      {/* 5. Bottom Status / Fresher Stage Footer */}
      <footer className="relative z-30 px-4 sm:px-6 py-3 flex items-center justify-between text-[11px] sm:text-xs text-cyan-200/60">
        <div className="flex items-center gap-2 truncate">
          <span className="truncate">Freshers Live Pond</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold shrink-0">Live</span>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link to="/submit" className="hover:text-cyan-300 underline">
            Submit Dare
          </Link>
          <span>•</span>
          <Link to="/admin/login" className="hover:text-cyan-300">
            Admin
          </Link>
        </div>
      </footer>

      {/* 6. Big Screen Challenge Reveal Dialog */}
      <ChallengeReveal
        challenge={currentChallenge}
        isOpen={phase === 'revealed'}
        onNextFresher={resetRound}
        isPresentationMode={isFullscreen}
      />
    </div>
  );
};
