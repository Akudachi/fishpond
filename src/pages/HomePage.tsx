import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Fish, Send, Sparkles, CheckCircle2, ArrowRight, Shield, Award } from 'lucide-react';
import { FishPondCanvas } from '../components/FishPondCanvas';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#020d1c] text-slate-100 overflow-x-hidden">
      <Header />

      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden px-4 sm:px-6 lg:px-8 py-16">
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
            Students submit the dares. The admin approves them. You catch a fish and discover your surprise challenge live on stage!
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link
              to="/pond"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-black text-base sm:text-xl text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 transition-all shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:shadow-[0_0_50px_rgba(6,182,212,0.8)] hover:scale-105 active:scale-95 flex items-center justify-center gap-3"
            >
              <Fish className="w-6 h-6 stroke-[2.5]" />
              <span>Enter The Fish Pond</span>
              <span className="text-xl">🌊</span>
            </Link>

            <Link
              to="/submit"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 rounded-2xl font-bold text-base sm:text-xl text-white glass-panel-glow hover:bg-slate-800/80 transition-all border border-cyan-400/30 hover:border-cyan-400/60 hover:scale-105 active:scale-95 flex items-center justify-center gap-3 shadow-lg"
            >
              <Send className="w-5 h-5 text-cyan-300" />
              <span>Submit Your Challenge</span>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase mb-4">
            HOW THE FISH POND WORKS
          </h2>
          <p className="text-cyan-200/80 text-base sm:text-lg max-w-xl mx-auto">
            Three simple steps powering the auditorium entertainment for college freshers day.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="glass-panel-glow rounded-3xl p-8 border border-cyan-500/30 flex flex-col items-center text-center relative group hover:border-cyan-400/60 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center mb-6 shadow-lg shadow-cyan-500/30 group-hover:scale-110 transition-transform">
              <Send className="w-8 h-8 text-white stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2">
              STEP 1 — SUBMIT
            </span>
            <h3 className="text-2xl font-black text-white mb-3">
              Students Contribute
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              Anyone with the link can submit hilarious dares, dances, retro songs, or impersonation challenges from their phones.
            </p>
          </motion.div>

          {/* Step 2 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="glass-panel-glow rounded-3xl p-8 border border-amber-500/30 flex flex-col items-center text-center relative group hover:border-amber-400/60 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center mb-6 shadow-lg shadow-amber-500/30 group-hover:scale-110 transition-transform">
              <Shield className="w-8 h-8 text-white stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-amber-400 uppercase tracking-widest mb-2">
              STEP 2 — APPROVE
            </span>
            <h3 className="text-2xl font-black text-white mb-3">
              Admin Moderates
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              The organizing committee reviews all submissions in real-time, editing wording or filtering out inappropriate entries.
            </p>
          </motion.div>

          {/* Step 3 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="glass-panel-glow rounded-3xl p-8 border border-teal-500/30 flex flex-col items-center text-center relative group hover:border-teal-400/60 transition-all"
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-500 flex items-center justify-center mb-6 shadow-lg shadow-teal-500/30 group-hover:scale-110 transition-transform">
              <Award className="w-8 h-8 text-slate-950 stroke-[2.5]" />
            </div>
            <span className="text-xs font-black text-teal-400 uppercase tracking-widest mb-2">
              STEP 3 — CATCH
            </span>
            <h3 className="text-2xl font-black text-white mb-3">
              Freshers Play Live
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              On stage, freshers click the hook to catch a swimming fish, triggering the 2-second reel animation and big auditorium challenge reveal!
            </p>
          </motion.div>
        </div>
      </section>

      {/* Quick Auditorium Callout */}
      <section className="relative z-10 py-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-16">
        <div className="rounded-3xl glass-panel-glow border-2 border-cyan-400/30 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-bold uppercase mb-3">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>Projector Ready</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white mb-2">
              Equipped with Fullscreen Auditorium Mode
            </h3>
            <p className="text-slate-300 text-sm sm:text-base max-w-xl">
              Connect your laptop to any auditorium projector or stage LED display. Huge high-contrast typography ensures readability even from the back row.
            </p>
          </div>

          <Link
            to="/pond"
            className="px-8 py-4 rounded-xl font-extrabold text-sm text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all shrink-0 flex items-center gap-2 shadow-lg shadow-cyan-500/30"
          >
            <span>Launch Game</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};
