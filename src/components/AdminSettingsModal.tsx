import React, { useState, useEffect } from 'react';
import { X, Save, Settings } from 'lucide-react';
import type { EventSettings } from '../types/challenge';

interface AdminSettingsModalProps {
  settings: EventSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updated: Partial<EventSettings>) => Promise<boolean>;
}

export const AdminSettingsModal: React.FC<AdminSettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  const [eventTitle, setEventTitle] = useState(settings.event_title);
  const [collegeName, setCollegeName] = useState(settings.college_name);
  const [subtitle, setSubtitle] = useState(settings.subtitle);
  const [gameEnabled, setGameEnabled] = useState(settings.game_enabled);
  const [soundDefault, setSoundDefault] = useState(settings.sound_enabled_default);
  const [minApproved, setMinApproved] = useState(settings.min_approved_required);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (settings) {
      setEventTitle(settings.event_title);
      setCollegeName(settings.college_name);
      setSubtitle(settings.subtitle);
      setGameEnabled(settings.game_enabled);
      setSoundDefault(settings.sound_enabled_default);
      setMinApproved(settings.min_approved_required);
    }
  }, [settings]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const ok = await onSave({
      event_title: eventTitle.trim() || 'Freshers Fish Pond',
      college_name: collegeName.trim() || 'College Freshers 2026',
      subtitle: subtitle.trim(),
      game_enabled: gameEnabled,
      sound_enabled_default: soundDefault,
      min_approved_required: Number(minApproved) || 1,
    });
    setIsSaving(false);
    if (ok) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="w-full max-w-xl rounded-2xl glass-panel-glow border border-cyan-500/30 p-6 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white">Event Configuration Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Event Title
              </label>
              <input
                type="text"
                value={eventTitle}
                onChange={(e) => setEventTitle(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                College / Institution Name
              </label>
              <input
                type="text"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                required
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Event Subtitle / Tagline
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl glass-input text-white text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Min. Approved Challenges to Play
              </label>
              <input
                type="number"
                min={1}
                max={50}
                value={minApproved}
                onChange={(e) => setMinApproved(Number(e.target.value))}
                className="w-full px-3 py-2.5 rounded-xl glass-input text-white text-sm"
              />
            </div>

            <div className="flex flex-col justify-end space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gameEnabled}
                  onChange={(e) => setGameEnabled(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-xs font-semibold text-slate-200">Game Active / Enabled</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={soundDefault}
                  onChange={(e) => setSoundDefault(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-500 focus:ring-cyan-400"
                />
                <span className="text-xs font-semibold text-slate-200">Sound Effects Enabled by Default</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
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
              <span>{isSaving ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
