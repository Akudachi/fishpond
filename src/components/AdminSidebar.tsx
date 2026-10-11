import React, { useState } from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Settings, 
  LogOut, 
  Database, 
  Fish,
  ExternalLink,
  Copy,
  Check,
  Send
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface AdminSidebarProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
  };
  activeTab: 'all' | 'pending' | 'approved' | 'rejected';
  onTabChange: (tab: 'all' | 'pending' | 'approved' | 'rejected') => void;
  onOpenSettings: () => void;
  onLogout: () => void;
  userEmail: string | null;
  isDemoMode: boolean;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  stats,
  activeTab,
  onTabChange,
  onOpenSettings,
  onLogout,
  userEmail,
  isDemoMode,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const copyUrl = (path: string, key: string) => {
    const url = `${window.location.origin}${path}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(key);
      setTimeout(() => setCopiedLink(null), 2500);
    });
  };

  const tabs = [
    { id: 'all', label: 'All Submissions', count: stats.total, icon: Inbox },
    { id: 'pending', label: 'Pending Review', count: stats.pending, icon: Clock, badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
    { id: 'approved', label: 'Approved Dares', count: stats.approved, icon: CheckCircle2, badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
    { id: 'rejected', label: 'Rejected Dares', count: stats.rejected, icon: XCircle, badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  ] as const;

  return (
    <aside className="w-full lg:w-72 glass-panel rounded-3xl p-5 border border-cyan-500/20 flex flex-col justify-between gap-6 shrink-0">
      <div>
        {/* Admin Brand & User Email */}
        <div className="pb-5 border-b border-slate-800">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
              <Fish className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white leading-tight">Admin Console</h2>
              <p className="text-xs text-slate-400 truncate max-w-[170px]" title={userEmail || ''}>
                {userEmail || 'Administrator'}
              </p>
            </div>
          </div>

          {/* Connection status badge */}
          <div className="mt-3">
            {isDemoMode ? (
              <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                <span>Local Interactive Mode</span>
              </div>
            ) : (
              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                <Database className="w-3.5 h-3.5 text-emerald-400" />
                <span>Supabase Live Connected</span>
              </div>
            )}
          </div>
        </div>

        {/* Tab filters navigation */}
        <div className="mt-5 space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-3">
            Submission Queues
          </span>

          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onTabChange(tab.id)}
                className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-between transition-all cursor-pointer ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-slate-950' : 'text-cyan-400'}`} />
                  <span>{tab.label}</span>
                </div>
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-slate-950/20 text-slate-950' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Link Sharing Widgets */}
        <div className="mt-6 pt-5 border-t border-slate-800 space-y-2">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-1 block mb-2">
            Event Direct Links
          </span>

          {/* Copy Submit Link */}
          <button
            onClick={() => copyUrl('/submit', 'submit')}
            className="w-full px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-slate-900/80 hover:bg-slate-800 border border-slate-800 flex items-center justify-between transition-colors cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <Send className="w-3.5 h-3.5 text-emerald-400" />
              <span>Share Submit Link</span>
            </div>
            {copiedLink === 'submit' ? (
              <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                <Check className="w-3 h-3" /> Copied!
              </span>
            ) : (
              <Copy className="w-3 h-3 text-slate-400" />
            )}
          </button>

          {/* Open / Copy Auditorium Pond Link */}
          <div className="flex items-center gap-1.5">
            <Link
              to="/pond"
              target="_blank"
              rel="noreferrer"
              className="flex-1 px-3 py-2 rounded-xl text-xs font-bold text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-between transition-all"
            >
              <div className="flex items-center gap-2">
                <Fish className="w-3.5 h-3.5 text-cyan-400" />
                <span>Auditorium Pond</span>
              </div>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={() => copyUrl('/pond', 'pond')}
              title="Copy Pond link"
              className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 cursor-pointer"
            >
              {copiedLink === 'pond' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Footer controls: Settings & Logout */}
      <div className="space-y-2 pt-4 border-t border-slate-800">
        <button
          onClick={onOpenSettings}
          className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <Settings className="w-4 h-4 text-cyan-400" />
          <span>Event Settings</span>
        </button>

        <button
          onClick={onLogout}
          className="w-full px-3.5 py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/30 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-rose-400" />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};
