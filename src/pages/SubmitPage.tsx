import React from 'react';
import { Link } from 'react-router-dom';
import { SubmissionForm } from '../components/SubmissionForm';
import { FishPondCanvas } from '../components/FishPondCanvas';
import { Shield } from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';

export const SubmitPage: React.FC = () => {
  const { isAdmin } = useAdminAuth();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#020d1c] text-slate-100 overflow-x-hidden relative p-3 sm:p-6 md:p-10">
      {/* Ambient background canvas ripples */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-40">
        <FishPondCanvas />
        <div className="absolute inset-0 bg-[#020d1c]/75 backdrop-blur-[2px]" />
      </div>

      {/* Top Brand Tag */}
      <header className="relative z-10 w-full max-w-2xl mx-auto flex items-center justify-between pt-1 sm:pt-2 pb-4 sm:pb-6">
        <Link to="/" className="text-xs font-bold text-cyan-300/80 hover:text-cyan-200 transition-colors uppercase tracking-wider flex items-center gap-1.5">
          <span>Freshers Fish Pond</span>
        </Link>
        <span className="text-[10px] sm:text-[11px] font-semibold text-slate-400 bg-slate-900/60 px-2.5 py-0.5 rounded-full border border-slate-800">
          Student Portal
        </span>
      </header>

      {/* Main Submission Form Container */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center max-w-2xl mx-auto w-full py-4">
        <div className="w-full">
          <SubmissionForm />
        </div>
      </main>

      {/* Discreet bottom admin link */}
      <footer className="relative z-10 w-full max-w-2xl mx-auto pt-8 pb-4 flex items-center justify-center text-xs">
        <Link
          to={isAdmin ? '/admin/dashboard' : '/admin/login'}
          className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-900/40"
        >
          <Shield className="w-3.5 h-3.5 text-cyan-500/70" />
          <span>{isAdmin ? 'Admin Dashboard' : 'Admin Login'}</span>
        </Link>
      </footer>
    </div>
  );
};
