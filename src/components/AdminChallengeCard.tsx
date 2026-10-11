import React, { useState } from 'react';
import { Check, X, Edit2, Trash2, RotateCcw, User, Clock, AlertTriangle, Fish } from 'lucide-react';
import type { Challenge } from '../types/challenge';

interface AdminChallengeCardProps {
  challenge: Challenge;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
  onRestore: (id: string) => void;
  onEdit: (challenge: Challenge) => void;
  onDelete: (id: string) => void;
}

export const AdminChallengeCard: React.FC<AdminChallengeCardProps> = ({
  challenge,
  onApprove,
  onReject,
  onRestore,
  onEdit,
  onDelete,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getStatusBadge = (status: Challenge['status']) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            In Pond (Active)
          </span>
        );
      case 'completed':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 flex items-center gap-1">
            <Fish className="w-3.5 h-3.5 text-cyan-400" />
            Caught on Stage
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            Rejected
          </span>
        );
      case 'pending':
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Pending Review
          </span>
        );
    }
  };

  const formattedDate = new Date(challenge.created_at).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="glass-panel rounded-2xl p-5 border border-cyan-500/20 hover:border-cyan-400/40 transition-all flex flex-col justify-between gap-4">
      <div>
        {/* Header row: Status & Timestamp */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            {getStatusBadge(challenge.status)}
          </div>

          <div className="flex items-center gap-1 text-xs text-slate-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Challenge Text */}
        <p className="text-white text-base font-semibold leading-snug mb-3">
          "{challenge.challenge_text}"
        </p>

        {/* Student Name */}
        <div className="flex items-center gap-1.5 text-xs text-cyan-300 font-semibold bg-cyan-950/40 px-3 py-1.5 rounded-lg border border-cyan-500/20 w-fit">
          <User className="w-3.5 h-3.5 text-amber-400" />
          <span>By: {challenge.student_name}</span>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {showDeleteConfirm ? (
        <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-rose-200 text-xs font-medium">
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>Permanently delete this challenge?</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-800 text-slate-300 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onDelete(challenge.id);
                setShowDeleteConfirm(false);
              }}
              className="px-2.5 py-1 rounded-lg text-xs font-bold bg-rose-600 text-white hover:bg-rose-500 cursor-pointer"
            >
              Confirm
            </button>
          </div>
        </div>
      ) : (
        /* Action buttons bar */
        <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            {/* Edit Button */}
            <button
              onClick={() => onEdit(challenge)}
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1"
              title="Edit challenge text"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Edit</span>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 hover:text-rose-200 border border-rose-500/30 transition-colors cursor-pointer text-xs flex items-center gap-1.5 font-semibold"
              title="Delete dare permanently"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-400" />
              <span>Delete</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            {challenge.status === 'rejected' ? (
              <button
                onClick={() => onRestore(challenge.id)}
                className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Restore</span>
              </button>
            ) : (
              <>
                <button
                  onClick={() => onReject(challenge.id)}
                  className="px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                {challenge.status !== 'approved' && (
                  <button
                    onClick={() => onApprove(challenge.id)}
                    className="px-3 sm:px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs transition-all shadow-md shadow-emerald-500/20 cursor-pointer flex items-center gap-1"
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                    <span>{challenge.status === 'completed' ? 'Re-add to Pond' : 'Approve'}</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
