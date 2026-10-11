import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Send, Sparkles } from 'lucide-react';
import { FishPondCanvas } from '../components/FishPondCanvas';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#020d1c] text-slate-100 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative flex-1 flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-20 min-h-[75vh]">
        {/* Live Canvas Underwater Background */}
        <div className="absolute inset-0 z-0">
          <FishPondCanvas className="w-full h-full opacity-85" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020d1c] via-transparent to-transparent pointer-events-none" />
        </div>

        {/* Hero Content Overlay */}
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-panel border border-cyan-400/40 text-cyan-300 font-bold text-xs sm:text-sm uppercase tracking-widest mb-6 shadow-[0_0_20px_rgba(6,182,212,0.3)]"
          >
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
            <span>COLLEGE FRESHERS DAY LIVE EVENT</span>
            <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight leading-none uppercase mb-6 projector-title"
          >
            READY TO CATCH A{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300">
              CHALLENGE?
            </span>{' '}
            🎣
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl text-cyan-100/90 max-w-2xl mx-auto font-medium leading-relaxed mb-10 drop-shadow"
          >
            Students submit the dares. The admin approves them. Freshers discover surprise challenges live on stage!
          </motion.p>

          {/* Action CTA: Only Submit Your Challenge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <Link
              to="/submit"
              className="w-full sm:w-auto px-10 sm:px-14 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 transition-all shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Send className="w-6 h-6 stroke-[2.5]" />
              <span>Submit Your Challenge</span>
              <span className="text-xl">✍️</span>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
