import type { Challenge, EventSettings } from '../types/challenge';

const LOCAL_STORAGE_CHALLENGES_KEY = 'fishpond_local_challenges_v1';
const LOCAL_STORAGE_SETTINGS_KEY = 'fishpond_local_settings_v1';
const LOCAL_STORAGE_ADMIN_KEY = 'fishpond_local_admin_session';

const INITIAL_SEED_CHALLENGES: Challenge[] = [
  {
    id: 'f101-1111-2222-3333-444455556661',
    student_name: 'Rahul (CS Dept)',
    challenge_text: 'Perform the iconic hook step from your favorite Bollywood or pop song on stage!',
    category: 'General Dare',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
  {
    id: 'f101-1111-2222-3333-444455556662',
    student_name: 'Ananya (BioTech)',
    challenge_text: 'Sing the chorus of your favorite retro song in a dramatic opera voice!',
    category: 'General Dare',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 3).toISOString(),
  },
  {
    id: 'f101-1111-2222-3333-444455556663',
    student_name: 'Vikram',
    challenge_text: 'Introduce yourself using only famous cinematic dialogues without breaking character.',
    category: 'General Dare',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'f101-1111-2222-3333-444455556664',
    student_name: 'Sneha',
    challenge_text: 'Do a slow-motion ramp walk across the stage like an international high-fashion model.',
    category: 'General Dare',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 1.5).toISOString(),
  },
  {
    id: 'f101-1111-2222-3333-444455556665',
    student_name: 'Kavya',
    challenge_text: 'Give a 30-second standup review of today’s college cafeteria lunch!',
    category: 'General Dare',
    status: 'approved',
    created_at: new Date(Date.now() - 3600000 * 1).toISOString(),
  },
  {
    id: 'f101-1111-2222-3333-444455556666',
    student_name: 'Adarsh',
    challenge_text: 'Challenge a senior to an impromptu rock-paper-scissors duel. Loser does 5 squats!',
    category: 'General Dare',
    status: 'approved',
    created_at: new Date(Date.now() - 1800000).toISOString(),
  },
  {
    id: 'f101-1111-2222-3333-444455556667',
    student_name: 'Tarun (Mechanical)',
    challenge_text: 'Dance to an imaginary music track for 15 seconds with full auditorium enthusiasm!',
    category: 'General Dare',
    status: 'pending',
    created_at: new Date(Date.now() - 900000).toISOString(),
  },
  {
    id: 'f101-1111-2222-3333-444455556668',
    student_name: 'Megha (ECE)',
    challenge_text: 'Recite the English alphabet backwards from Z to A in under 15 seconds.',
    category: 'General Dare',
    status: 'pending',
    created_at: new Date(Date.now() - 300000).toISOString(),
  },
];

export const DEFAULT_EVENT_SETTINGS: EventSettings = {
  id: 'default',
  event_title: 'Freshers Fish Pond',
  college_name: 'College Freshers 2026',
  subtitle: 'One Pond. Endless Surprises. Your Challenge Awaits!',
  game_enabled: true,
  sound_enabled_default: true,
  categories: ['General Dare'],
  min_approved_required: 1,
  updated_at: new Date().toISOString(),
};

export const storageFallback = {
  getChallenges(): Challenge[] {
    const saved = localStorage.getItem(LOCAL_STORAGE_CHALLENGES_KEY);
    if (!saved) {
      localStorage.setItem(LOCAL_STORAGE_CHALLENGES_KEY, JSON.stringify(INITIAL_SEED_CHALLENGES));
      return INITIAL_SEED_CHALLENGES;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return INITIAL_SEED_CHALLENGES;
    }
  },

  saveChallenges(challenges: Challenge[]) {
    localStorage.setItem(LOCAL_STORAGE_CHALLENGES_KEY, JSON.stringify(challenges));
  },

  addChallenge(student_name: string, challenge_text: string): Challenge {
    const current = this.getChallenges();
    const newChallenge: Challenge = {
      id: crypto.randomUUID ? crypto.randomUUID() : 'f-' + Math.random().toString(36).substring(2, 9),
      student_name: student_name.trim(),
      challenge_text: challenge_text.trim(),
      category: 'General Dare',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    current.unshift(newChallenge);
    this.saveChallenges(current);
    return newChallenge;
  },

  updateChallengeStatus(id: string, status: 'approved' | 'rejected' | 'pending' | 'completed'): Challenge | null {
    const current = this.getChallenges();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return null;
    current[index] = {
      ...current[index],
      status,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    this.saveChallenges(current);
    return current[index];
  },

  markChallengeCaught(id: string): Challenge | null {
    return this.updateChallengeStatus(id, 'completed');
  },

  updateChallengeText(id: string, text: string): Challenge | null {
    const current = this.getChallenges();
    const index = current.findIndex((c) => c.id === id);
    if (index === -1) return null;
    current[index] = {
      ...current[index],
      challenge_text: text.trim(),
      updated_at: new Date().toISOString(),
    };
    this.saveChallenges(current);
    return current[index];
  },

  deleteChallenge(id: string): boolean {
    const current = this.getChallenges();
    const filtered = current.filter((c) => c.id !== id);
    this.saveChallenges(filtered);
    return true;
  },

  getSettings(): EventSettings {
    const saved = localStorage.getItem(LOCAL_STORAGE_SETTINGS_KEY);
    if (!saved) return DEFAULT_EVENT_SETTINGS;
    try {
      return { ...DEFAULT_EVENT_SETTINGS, ...JSON.parse(saved) };
    } catch {
      return DEFAULT_EVENT_SETTINGS;
    }
  },

  saveSettings(settings: Partial<EventSettings>): EventSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings, updated_at: new Date().toISOString() };
    localStorage.setItem(LOCAL_STORAGE_SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  },

  getAdminSession() {
    const saved = localStorage.getItem(LOCAL_STORAGE_ADMIN_KEY);
    return saved ? JSON.parse(saved) : null;
  },

  setAdminSession(session: { email: string; role: string } | null) {
    if (session) {
      localStorage.setItem(LOCAL_STORAGE_ADMIN_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(LOCAL_STORAGE_ADMIN_KEY);
    }
  },
};
