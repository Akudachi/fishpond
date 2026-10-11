import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Search, 
  RefreshCw, 
  Inbox, 
  ChevronLeft, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle,
  Fish,
  ExternalLink
} from 'lucide-react';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useChallenges, useEventSettings } from '../hooks/useChallenges';
import { AdminSidebar } from '../components/AdminSidebar';
import { AdminChallengeCard } from '../components/AdminChallengeCard';
import { AdminEditModal } from '../components/AdminEditModal';
import { AdminSettingsModal } from '../components/AdminSettingsModal';
import type { Challenge } from '../types/challenge';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { isAdmin, userEmail, isLoading: isAuthLoading, logout, isDemoMode } = useAdminAuth();
  const {
    challenges,
    paginatedChallenges,
    filteredChallenges,
    isLoading: isDataLoading,
    error,
    stats,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    refreshChallenges,
    approveChallenge,
    rejectChallenge,
    restoreChallenge,
    editChallenge,
    deleteChallenge,
  } = useChallenges();

  const { settings, updateSettings } = useEventSettings();

  // Modals
  const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Protect admin dashboard
  useEffect(() => {
    if (!isAuthLoading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAuthLoading, isAdmin, navigate]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020e21] text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-cyan-200">Verifying administrative credentials...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020e21] text-slate-100 flex flex-col">
      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl glass-panel-glow border text-xs font-semibold shadow-2xl transition-all">
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400" />
          )}
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Top Admin Header Bar with prominent PLAY POND button */}
      <header className="w-full glass-panel border-b border-cyan-500/20 px-4 sm:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 flex items-center justify-center border border-cyan-400/30">
              <Fish className="w-5 h-5 text-cyan-400" />
            </div>
            <span className="font-bold text-sm tracking-wide text-white hidden sm:inline">
              Freshers Fish Pond Console
            </span>
          </Link>
        </div>

        {/* Prominent Play Pond Button */}
        <div className="flex items-center gap-3">
          <Link
            to="/pond"
            className="px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-300 to-amber-300 hover:from-cyan-300 hover:to-amber-200 transition-all shadow-md shadow-cyan-500/30 flex items-center gap-2 transform hover:scale-105 active:scale-95"
          >
            <Fish className="w-4 h-4 stroke-[2.5]" />
            <span>Play Fish Pond</span>
            <span className="text-base">🎣</span>
          </Link>
        </div>
      </header>

      {/* Main Dashboard Container */}
      <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col lg:flex-row gap-8">
        {/* Admin Sidebar */}
        <AdminSidebar
          stats={stats}
          activeTab={activeTab}
          onTabChange={(tab) => {
            setActiveTab(tab);
            setCurrentPage(1);
          }}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onLogout={async () => {
            await logout();
            navigate('/admin/login');
          }}
          userEmail={userEmail}
          isDemoMode={isDemoMode}
        />

        {/* Dashboard Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0">
          {/* Top Stat Cards Header Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 mb-6">
            <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Total</span>
              <span className="text-2xl font-black text-white mt-1 block">{stats.total}</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-amber-500/30">
              <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block">Pending</span>
              <span className="text-2xl font-black text-amber-300 mt-1 block">{stats.pending}</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-emerald-500/30">
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">Approved</span>
              <span className="text-2xl font-black text-emerald-300 mt-1 block">{stats.approved}</span>
            </div>

            <div className="glass-panel rounded-2xl p-4 border border-rose-500/30">
              <span className="text-[11px] font-bold text-rose-400 uppercase tracking-wider block">Rejected</span>
              <span className="text-2xl font-black text-rose-300 mt-1 block">{stats.rejected}</span>
            </div>
          </div>

          {/* Search and Refresh Bar */}
          <div className="glass-panel rounded-2xl p-4 border border-cyan-500/20 mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search dares or student names..."
                className="w-full pl-9 pr-4 py-2 rounded-xl glass-input text-xs text-white placeholder-slate-400"
              />
            </div>

            {/* Manual Refresh & Quick Pond launch */}
            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              <button
                onClick={async () => {
                  await refreshChallenges();
                  showToast('Challenges updated from database');
                }}
                className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5"
                title="Refresh submissions"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isDataLoading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <Link
                to="/pond"
                target="_blank"
                rel="noreferrer"
                className="px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-400/40 text-xs font-bold flex items-center gap-1.5 transition-all"
                title="Open live pond in new tab"
              >
                <span>Auditorium Pond</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Error notice */}
          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-3">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Submission List / Cards Grid */}
          {isDataLoading && challenges.length === 0 ? (
            /* Loading skeletons */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="h-44 rounded-2xl glass-panel animate-pulse p-5" />
              ))}
            </div>
          ) : paginatedChallenges.length === 0 ? (
            /* Empty state */
            <div className="glass-panel rounded-3xl p-12 text-center border border-cyan-500/20 my-auto">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Inbox className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">No submissions found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                {searchQuery
                  ? 'No challenges matched your search. Try a different query.'
                  : activeTab === 'pending'
                  ? 'Great job! There are no pending challenges waiting for review.'
                  : 'No submissions in this queue yet.'}
              </p>
            </div>
          ) : (
            /* Cards Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
              {paginatedChallenges.map((challenge) => (
                <AdminChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  onApprove={async (id) => {
                    const ok = await approveChallenge(id);
                    if (ok) showToast('Challenge approved and added to live pond!');
                  }}
                  onReject={async (id) => {
                    const ok = await rejectChallenge(id);
                    if (ok) showToast('Challenge rejected.');
                  }}
                  onRestore={async (id) => {
                    const ok = await restoreChallenge(id);
                    if (ok) showToast('Challenge returned to pending review.');
                  }}
                  onEdit={(c) => setEditingChallenge(c)}
                  onDelete={async (id) => {
                    const ok = await deleteChallenge(id);
                    if (ok) showToast('Challenge deleted permanently.');
                  }}
                />
              ))}
            </div>
          )}

          {/* Pagination Footer */}
          {totalPages > 1 && (
            <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>
                Showing {(currentPage - 1) * 8 + 1} to{' '}
                {Math.min(currentPage * 8, filteredChallenges.length)} of {filteredChallenges.length} challenges
              </span>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="px-2 font-mono font-semibold text-white">
                  {currentPage} / {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Edit Challenge Modal */}
      <AdminEditModal
        challenge={editingChallenge}
        isOpen={Boolean(editingChallenge)}
        onClose={() => setEditingChallenge(null)}
        onSave={async (id, text) => {
          const ok = await editChallenge(id, text);
          if (ok) showToast('Challenge updated successfully.');
          return ok;
        }}
      />

      {/* Event Settings Modal */}
      <AdminSettingsModal
        settings={settings}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        onSave={async (updated) => {
          const ok = await updateSettings(updated);
          if (ok) showToast('Event configuration settings saved.');
          return ok;
        }}
      />
    </div>
  );
};
