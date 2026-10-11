import React from 'react';
import { Fish, Heart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-cyan-500/20 bg-[#020b17] py-8 px-4 sm:px-6 lg:px-8 text-slate-400 text-sm">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
            <Fish className="w-4 h-4 text-cyan-400" />
          </div>
          <div>
            <p className="font-bold text-slate-200 text-xs sm:text-sm">Freshers Fish Pond</p>
            <p className="text-[11px] text-slate-400">Interactive College Freshers Day Game</p>
          </div>
        </div>

        {/* Bottom link: ONLY Admin Portal as requested */}
        <div className="flex items-center gap-6 text-xs text-slate-400">
          <Link
            to="/admin/login"
            className="text-slate-400 hover:text-cyan-300 transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800"
          >
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Admin Portal</span>
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
