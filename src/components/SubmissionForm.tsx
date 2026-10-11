import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, AlertCircle, Sparkles, User, HelpCircle } from 'lucide-react';
import { useSubmitChallenge } from '../hooks/useChallenges';

export const SubmissionForm: React.FC = () => {
  const [studentName, setStudentName] = useState('');
  const [challengeText, setChallengeText] = useState('');

  const { submit, isSubmitting, submissionSuccess, error, resetStatus } = useSubmitChallenge();

  const charCount = challengeText.trim().length;
  const isOverLimit = charCount > 250;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    const res = await submit({
      student_name: studentName,
      challenge_text: challengeText,
    });

    if (res.success) {
      setStudentName('');
      setChallengeText('');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <AnimatePresence mode="wait">
        {submissionSuccess ? (
          <motion.div
            key="success-card"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -20 }}
            className="glass-panel-glow rounded-3xl p-8 md:p-12 text-center border-2 border-emerald-400/50 shadow-[0_0_50px_rgba(16,185,129,0.3)] relative overflow-hidden"
          >
            {/* Background glowing particles */}
            <div className="absolute -top-20 -right-20 w-60 h-60 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-tr from-emerald-400 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/40 mb-6">
              <CheckCircle className="w-12 h-12 text-slate-950 stroke-[2.5]" />
            </div>

            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-wide uppercase mb-3">
              YOUR CHALLENGE HAS ENTERED THE POND! 🐟
            </h3>

            <p className="text-slate-300 text-base md:text-lg mb-8 max-w-lg mx-auto">
              Thanks for contributing! Your challenge will appear in the game only after admin approval.
            </p>

            {/* ONLY Submit Another Dare (Enter Pond link removed) */}
            <div className="flex items-center justify-center">
              <button
                onClick={resetStatus}
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-slate-900 bg-cyan-400 hover:bg-cyan-300 transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg shadow-cyan-500/30 hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5 text-slate-950" />
                <span>Submit Another Dare</span>
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="form-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel-glow rounded-3xl p-6 sm:p-10 border border-cyan-400/30 shadow-[0_15px_45px_rgba(0,0,0,0.5)]"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 font-bold text-xs uppercase tracking-wider mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Freshers Day Special</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Drop Your Dare Into The Pond!
              </h2>
              <p className="text-slate-300 text-sm mt-2">
                Contribute a funny, creative challenge or dare for freshers to catch during the stage event.
              </p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-4 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 flex items-start gap-3 text-sm"
              >
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Student Name (REQUIRED) */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <User className="w-4 h-4 text-cyan-400" />
                    <span>Your Name <span className="text-rose-400">*</span></span>
                  </span>
                  <span className="text-xs text-rose-300 font-medium">Required</span>
                </label>
                <input
                  type="text"
                  required
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="e.g. Rahul / Sneha (CS Dept)"
                  minLength={2}
                  maxLength={60}
                  className="w-full px-4 py-3.5 rounded-xl glass-input text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-cyan-400"
                />
              </div>

              {/* Challenge Text (Required) */}
              <div>
                <label className="block text-sm font-semibold text-slate-200 mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>The Challenge / Dare <span className="text-rose-400">*</span></span>
                  </span>
                  <span
                    className={`text-xs font-mono font-medium ${
                      isOverLimit ? 'text-rose-400 font-bold' : charCount >= 200 ? 'text-amber-400' : 'text-slate-400'
                    }`}
                  >
                    {charCount}/250 chars
                  </span>
                </label>
                <textarea
                  value={challengeText}
                  onChange={(e) => setChallengeText(e.target.value)}
                  rows={4}
                  required
                  placeholder="Example: Ask Adarsh to perform a hook step from his favourite movie song on stage!"
                  maxLength={250}
                  className="w-full px-4 py-3.5 rounded-xl glass-input text-white placeholder-slate-500 text-sm focus:ring-2 focus:ring-cyan-400 resize-none"
                />
                <p className="mt-1.5 text-xs text-slate-400">
                  Keep it funny, respectful, and entertaining for the whole auditorium!
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || !studentName.trim() || charCount < 5 || isOverLimit}
                className="w-full py-4 px-6 rounded-2xl font-black text-base text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_25px_rgba(6,182,212,0.5)] cursor-pointer flex items-center justify-center gap-2 transform active:scale-98"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Sending into Pond...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 stroke-[2.5]" />
                    <span>Submit Challenge 🎣</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <p className="text-xs text-slate-400">
                  🔒 All submissions are moderated by the committee before appearing in the pond game.
                </p>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
