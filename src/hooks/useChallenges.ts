import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storageFallback } from '../lib/storageFallback';
import type { Challenge, EventSettings } from '../types/challenge';
import { validateChallengeSubmission } from '../lib/validation';

export function useChallenges() {
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  const fetchChallenges = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    if (!isSupabaseConfigured) {
      const localData = storageFallback.getChallenges();
      setChallenges(localData);
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: fetchErr } = await supabase
        .from('challenges')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchErr) {
        throw new Error(fetchErr.message);
      }

      setChallenges(data || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to fetch challenges from database.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchChallenges();

    // Safe polling interval every 12 seconds
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') {
        fetchChallenges();
      }
    }, 12000);

    return () => clearInterval(interval);
  }, [fetchChallenges]);

  // Statistics
  const stats = useMemo(() => {
    const total = challenges.length;
    const pending = challenges.filter((c) => c.status === 'pending').length;
    const approved = challenges.filter((c) => c.status === 'approved').length;
    const rejected = challenges.filter((c) => c.status === 'rejected').length;
    return { total, pending, approved, rejected };
  }, [challenges]);

  // Filtered and searched challenges (Category removed)
  const filteredChallenges = useMemo(() => {
    return challenges.filter((item) => {
      // Tab filter
      if (activeTab !== 'all' && item.status !== activeTab) {
        return false;
      }
      // Search query (text or submitter name)
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesText = item.challenge_text.toLowerCase().includes(query);
        const matchesName = item.student_name ? item.student_name.toLowerCase().includes(query) : false;
        return matchesText || matchesName;
      }
      return true;
    });
  }, [challenges, activeTab, searchQuery]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredChallenges.length / itemsPerPage));
  const paginatedChallenges = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredChallenges.slice(start, start + itemsPerPage);
  }, [filteredChallenges, currentPage, itemsPerPage]);

  // Actions
  const approveChallenge = async (id: string): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured) {
        storageFallback.updateChallengeStatus(id, 'approved');
        setChallenges(storageFallback.getChallenges());
        return true;
      }

      const { data: session } = await supabase.auth.getSession();
      const currentUserId = session?.session?.user?.id;

      const { error: err } = await supabase
        .from('challenges')
        .update({
          status: 'approved',
          reviewed_at: new Date().toISOString(),
          reviewed_by: currentUserId || null,
        })
        .eq('id', id);

      if (err) throw err;
      await fetchChallenges();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to approve challenge.');
      return false;
    }
  };

  const rejectChallenge = async (id: string): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured) {
        storageFallback.updateChallengeStatus(id, 'rejected');
        setChallenges(storageFallback.getChallenges());
        return true;
      }

      const { data: session } = await supabase.auth.getSession();
      const currentUserId = session?.session?.user?.id;

      const { error: err } = await supabase
        .from('challenges')
        .update({
          status: 'rejected',
          reviewed_at: new Date().toISOString(),
          reviewed_by: currentUserId || null,
        })
        .eq('id', id);

      if (err) throw err;
      await fetchChallenges();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to reject challenge.');
      return false;
    }
  };

  const restoreChallenge = async (id: string): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured) {
        storageFallback.updateChallengeStatus(id, 'pending');
        setChallenges(storageFallback.getChallenges());
        return true;
      }

      const { error: err } = await supabase
        .from('challenges')
        .update({
          status: 'pending',
          reviewed_at: null,
          reviewed_by: null,
        })
        .eq('id', id);

      if (err) throw err;
      await fetchChallenges();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to restore challenge.');
      return false;
    }
  };

  const editChallenge = async (id: string, newText: string): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured) {
        storageFallback.updateChallengeText(id, newText);
        setChallenges(storageFallback.getChallenges());
        return true;
      }

      const { error: err } = await supabase
        .from('challenges')
        .update({
          challenge_text: newText.trim(),
        })
        .eq('id', id);

      if (err) throw err;
      await fetchChallenges();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to edit challenge.');
      return false;
    }
  };

  const deleteChallenge = async (id: string): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured) {
        storageFallback.deleteChallenge(id);
        setChallenges(storageFallback.getChallenges());
        return true;
      }

      const { error: err } = await supabase
        .from('challenges')
        .delete()
        .eq('id', id);

      if (err) throw err;
      await fetchChallenges();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete challenge.');
      return false;
    }
  };

  return {
    challenges,
    filteredChallenges,
    paginatedChallenges,
    isLoading,
    error,
    stats,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    currentPage,
    setCurrentPage,
    totalPages,
    refreshChallenges: fetchChallenges,
    approveChallenge,
    rejectChallenge,
    restoreChallenge,
    editChallenge,
    deleteChallenge,
  };
}

export function useSubmitChallenge() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: {
    student_name: string;
    challenge_text: string;
  }): Promise<{ success: boolean; error?: string }> => {
    setIsSubmitting(true);
    setError(null);
    setSubmissionSuccess(false);

    // Client-side validation: student_name is REQUIRED
    const validation = validateChallengeSubmission(data);
    if (!validation.isValid) {
      const firstError = Object.values(validation.errors)[0];
      setIsSubmitting(false);
      setError(firstError || 'Please correct the form errors.');
      return { success: false, error: firstError };
    }

    try {
      if (!isSupabaseConfigured) {
        storageFallback.addChallenge(
          data.student_name.trim(),
          data.challenge_text
        );
        setIsSubmitting(false);
        setSubmissionSuccess(true);
        return { success: true };
      }

      const { error: insertError } = await supabase.from('challenges').insert({
        student_name: data.student_name.trim(),
        challenge_text: data.challenge_text.trim(),
        category: 'General Dare', // Default fallback for database compatibility
        status: 'pending',
      });

      if (insertError) {
        throw new Error(insertError.message);
      }

      setIsSubmitting(false);
      setSubmissionSuccess(true);
      return { success: true };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Failed to submit challenge. Please try again.';
      setIsSubmitting(false);
      setError(errMsg);
      return { success: false, error: errMsg };
    }
  };

  const resetStatus = () => {
    setSubmissionSuccess(false);
    setError(null);
  };

  return {
    submit,
    isSubmitting,
    submissionSuccess,
    error,
    resetStatus,
  };
}

export function useEventSettings() {
  const [settings, setSettings] = useState<EventSettings>(storageFallback.getSettings());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = useCallback(async () => {
    setIsLoading(true);
    if (!isSupabaseConfigured) {
      setSettings(storageFallback.getSettings());
      setIsLoading(false);
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from('event_settings')
        .select('*')
        .eq('id', 'default')
        .single();

      if (err && err.code !== 'PGRST116') {
        throw err;
      }

      if (data) {
        setSettings(data as EventSettings);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load event settings.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  const updateSettings = async (updatedValues: Partial<EventSettings>): Promise<boolean> => {
    try {
      if (!isSupabaseConfigured) {
        const saved = storageFallback.saveSettings(updatedValues);
        setSettings(saved);
        return true;
      }

      const { error: err } = await supabase
        .from('event_settings')
        .update({
          ...updatedValues,
          updated_at: new Date().toISOString(),
        })
        .eq('id', 'default');

      if (err) throw err;
      await fetchSettings();
      return true;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update event settings.');
      return false;
    }
  };

  return {
    settings,
    isLoading,
    error,
    updateSettings,
    refreshSettings: fetchSettings,
  };
}
