import React from 'react';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { SubmissionForm } from '../components/SubmissionForm';
import { FishPondCanvas } from '../components/FishPondCanvas';
import { Sparkles, Shield } from 'lucide-react';

export const SubmitPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#020d1c] text-slate-100 overflow-x-hidden relative">
      <Header />

      {/* Subtle background canvas ripples */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FishPondCanvas />
        <div className="absolute inset-0 bg-[#020d1c]/70 backdrop-blur-[2px]" />
      </div>

      <main className="relative z-10 flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full flex flex-col justify-center">
        {/* Intro Tag */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Public Submission Link</span>
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase">
            SUBMIT A FRESHERS DARE
          </h1>
          <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-lg mx-auto">
            Got an unforgettable dare or funny challenge for your classmates or juniors? Drop it into the pond now!
          </p>
        </div>

        {/* Submission Form Component */}
        <SubmissionForm />

        {/* Community guidelines note */}
        <div className="mt-10 p-5 rounded-2xl glass-panel border border-cyan-500/20 max-w-2xl mx-auto text-xs text-slate-300 flex items-start gap-3">
          <Shield className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Friendly Event Guidelines</span>
            <p className="leading-relaxed">
              Please submit challenges that are lighthearted, respectful, and enjoyable for everyone in the auditorium. 
              The admin team reviews each submission prior to stage display. Vulgar, offensive, or unsafe entries will be removed.
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
