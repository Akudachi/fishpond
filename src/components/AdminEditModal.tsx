import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { Challenge } from '../types/challenge';

interface AdminEditModalProps {
  challenge: Challenge | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (id: string, text: string) => Promise<boolean>;
}

export const AdminEditModal: React.FC<AdminEditModalProps> = ({
  challenge,
  isOpen,
  onClose,
  onSave,
}) => {
  const [text, setText] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (challenge) {
      setText(challenge.challenge_text);
      setError(null);
    }
  }, [challenge]);

  if (!isOpen || !challenge) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) {
      setError('Challenge text cannot be empty.');
      return;
    }
    if (text.trim().length > 250) {
      setError('Challenge text cannot exceed 250 characters.');
      return;
    }

    setIsSaving(true);
    const ok = await onSave(challenge.id, text.trim());
    setIsSaving(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl glass-panel-glow border border-cyan-500/30 p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white">Edit Challenge Dare</h3>
            <p className="text-xs text-slate-400 mt-0.5">Submitted by: {challenge.student_name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Challenge Text
              </label>
              <span className="text-xs font-mono text-slate-400">
                {text.length}/250
              </span>
            </div>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={4}
              maxLength={250}
              required
              className="w-full px-3 py-2.5 rounded-xl glass-input text-white text-sm resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-slate-800 hover:bg-slate-700 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 rounded-xl text-xs font-bold text-slate-950 bg-cyan-400 hover:bg-cyan-300 transition-all flex items-center gap-1.5 shadow-md shadow-cyan-500/20 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Changes'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
