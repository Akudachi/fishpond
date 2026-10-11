import type { Challenge, EventSettings, AdminUser } from './challenge';

export interface Database {
  public: {
    Tables: {
      challenges: {
        Row: Challenge;
        Insert: {
          id?: string;
          student_name?: string | null;
          challenge_text: string;
          category?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
        Update: {
          id?: string;
          student_name?: string | null;
          challenge_text?: string;
          category?: string;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
          updated_at?: string;
          reviewed_at?: string | null;
          reviewed_by?: string | null;
        };
      };
      admin_users: {
        Row: AdminUser;
        Insert: {
          id: string;
          email: string;
          role?: 'admin' | 'superadmin';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'superadmin';
          created_at?: string;
        };
      };
      event_settings: {
        Row: EventSettings;
        Insert: {
          id?: string;
          event_title: string;
          college_name: string;
          subtitle: string;
          game_enabled?: boolean;
          sound_enabled_default?: boolean;
          categories?: string[];
          min_approved_required?: number;
          updated_at?: string;
        };
        Update: {
          id?: string;
          event_title?: string;
          college_name?: string;
          subtitle?: string;
          game_enabled?: boolean;
          sound_enabled_default?: boolean;
          categories?: string[];
          min_approved_required?: number;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_random_approved_challenge: {
        Args: { last_challenge_id?: string | null };
        Returns: {
          id: string;
          student_name: string | null;
          challenge_text: string;
          category: string;
          created_at: string;
        }[];
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
