import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storageFallback } from '../lib/storageFallback';

export interface AdminAuthState {
  isAdmin: boolean;
  userEmail: string | null;
  isLoading: boolean;
  error: string | null;
  isDemoMode: boolean;
}

export function useAdminAuth() {
  const [authState, setAuthState] = useState<AdminAuthState>({
    isAdmin: false,
    userEmail: null,
    isLoading: true,
    error: null,
    isDemoMode: !isSupabaseConfigured,
  });

  const checkAuth = useCallback(async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!isSupabaseConfigured) {
      // Local demo mode
      const session = storageFallback.getAdminSession();
      if (session) {
        setAuthState({
          isAdmin: true,
          userEmail: session.email,
          isLoading: false,
          error: null,
          isDemoMode: true,
        });
      } else {
        setAuthState({
          isAdmin: false,
          userEmail: null,
          isLoading: false,
          error: null,
          isDemoMode: true,
        });
      }
      return;
    }

    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      if (sessionError || !sessionData?.session?.user) {
        setAuthState({
          isAdmin: false,
          userEmail: null,
          isLoading: false,
          error: null,
          isDemoMode: false,
        });
        return;
      }

      const user = sessionData.session.user;

      // Check admin_users table for explicit authorization
      const { data: adminRecord, error: adminCheckError } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', user.id)
        .single();

      if (adminCheckError || !adminRecord) {
        // Not an authorized admin
        await supabase.auth.signOut();
        setAuthState({
          isAdmin: false,
          userEmail: null,
          isLoading: false,
          error: 'Access denied: Your account does not have administrator privileges.',
          isDemoMode: false,
        });
        return;
      }

      setAuthState({
        isAdmin: true,
        userEmail: user.email ?? null,
        isLoading: false,
        error: null,
        isDemoMode: false,
      });
    } catch (err: unknown) {
      setAuthState({
        isAdmin: false,
        userEmail: null,
        isLoading: false,
        error: err instanceof Error ? err.message : 'Authentication verification failed.',
        isDemoMode: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();

    if (isSupabaseConfigured) {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(() => {
        checkAuth();
      });

      return () => {
        subscription.unsubscribe();
      };
    }
  }, [checkAuth]);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setAuthState((prev) => ({ ...prev, isLoading: true, error: null }));

    if (!isSupabaseConfigured) {
      // Local demo login check
      if (email.trim() && password.length >= 4) {
        storageFallback.setAdminSession({ email, role: 'admin' });
        setAuthState({
          isAdmin: true,
          userEmail: email,
          isLoading: false,
          error: null,
          isDemoMode: true,
        });
        return { success: true };
      } else {
        const errorMsg = 'Please provide a valid email and password (min 4 characters).';
        setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        return { success: false, error: errorMsg };
      }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error || !data.user) {
        const errorMsg = error?.message || 'Invalid administrator login credentials.';
        setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
        return { success: false, error: errorMsg };
      }

      // Verify admin role
      const { data: adminRecord, error: adminErr } = await supabase
        .from('admin_users')
        .select('role')
        .eq('id', data.user.id)
        .single();

      if (adminErr || !adminRecord) {
        await supabase.auth.signOut();
        const errorMsg = 'Your account is authenticated but not registered in the admin roster.';
        setAuthState({
          isAdmin: false,
          userEmail: null,
          isLoading: false,
          error: errorMsg,
          isDemoMode: false,
        });
        return { success: false, error: errorMsg };
      }

      setAuthState({
        isAdmin: true,
        userEmail: data.user.email ?? email,
        isLoading: false,
        error: null,
        isDemoMode: false,
      });
      return { success: true };
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'An unexpected error occurred during login.';
      setAuthState((prev) => ({ ...prev, isLoading: false, error: errorMsg }));
      return { success: false, error: errorMsg };
    }
  };

  const logout = async () => {
    setAuthState((prev) => ({ ...prev, isLoading: true }));
    if (!isSupabaseConfigured) {
      storageFallback.setAdminSession(null);
    } else {
      await supabase.auth.signOut();
    }
    setAuthState({
      isAdmin: false,
      userEmail: null,
      isLoading: false,
      error: null,
      isDemoMode: !isSupabaseConfigured,
    });
  };

  return {
    ...authState,
    login,
    logout,
    refreshAuth: checkAuth,
  };
}
