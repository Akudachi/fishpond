import React from 'react';
import { Fish, Heart, Shield, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cyan-500/20 bg-[#020b17] py-10 px-4 sm:px-6 lg:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
            <Fish className="w-5 h-5 text-cyan-400" />
          </div>
          <div>
            <p className="font-bold text-slate-200">Freshers Fish Pond</p>
            <p className="text-xs text-slate-400">Official Interactive College Freshers Day Event Game</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 text-xs text-slate-400">
          <Link to="/" className="hover:text-cyan-300 transition-colors">
            Home
          </Link>
          <Link to="/submit" className="hover:text-cyan-300 transition-colors">
            Submit a Dare
          </Link>
          <Link to="/pond" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Play Pond
          </Link>
          <Link to="/admin/login" className="hover:text-cyan-300 transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            Admin Portal
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <span>Crafted with</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          <span>for Freshers Day</span>
        </div>
      </div>
    </footer>
  );
};
