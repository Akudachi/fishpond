import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Fish, Send, Waves, Menu, X } from 'lucide-react';

export const Header: React.FC = () => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { to: '/', label: 'Home', icon: Waves },
    { to: '/submit', label: 'Submit a Challenge', icon: Send },
  ];

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo & Brand Title */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3.5 group min-w-0">
            <div className="w-8 h-8 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(6,182,212,0.5)] group-hover:scale-105 transition-transform shrink-0">
              <Fish className="w-4 h-4 sm:w-6 sm:h-6 text-white animate-pulse" />
            </div>
            <div className="flex flex-col text-left min-w-0">
              <span className="text-sm xs:text-base sm:text-xl md:text-2xl font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300 font-heading truncate">
                FRESHERS FISH POND
              </span>
              <span className="text-[10px] sm:text-xs text-cyan-200/70 font-medium tracking-tight hidden sm:block">
                One Pond. Endless Surprises. Your Challenge Awaits!
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.to;

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
                    isActive
                      ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 shadow-inner'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-4 h-4 text-cyan-400" />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-cyan-300 hover:bg-slate-800 focus:outline-none cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel-glow border-t border-cyan-500/20 px-4 pt-3 pb-6 space-y-2">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold ${
                  isActive
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/30'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-5 h-5 text-cyan-400" />
                <span>{link.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
