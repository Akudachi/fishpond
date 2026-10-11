export type ChallengeStatus = 'pending' | 'approved' | 'rejected';

export type ChallengeCategory =
  | 'Funny'
  | 'Dance'
  | 'Singing'
  | 'Acting'
  | 'Friendship'
  | 'Romantic'
  | 'Talent'
  | 'General Dare';

export interface Challenge {
  id: string;
  student_name: string | null;
  challenge_text: string;
  category: string;
  status: ChallengeStatus;
  created_at: string;
  updated_at?: string;
  reviewed_at?: string | null;
  reviewed_by?: string | null;
}

export interface PublicApprovedChallenge {
  id: string;
  student_name: string | null;
  challenge_text: string;
  category: string;
  created_at: string;
}

export interface EventSettings {
  id: string;
  event_title: string;
  college_name: string;
  subtitle: string;
  game_enabled: boolean;
  sound_enabled_default: boolean;
  categories: string[];
  min_approved_required: number;
  updated_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'superadmin';
  created_at: string;
}
