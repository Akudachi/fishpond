import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { storageFallback } from '../lib/storageFallback';
import type { PublicApprovedChallenge } from '../types/challenge';
import { sounds } from '../lib/soundEffects';
import {
  getCaughtChallengeIds,
  saveCaughtChallengeId,
  resetAllCaughtChallengeIds,
} from '../lib/caughtChallenges';

export type GamePhase = 'idle' | 'hooking' | 'caught' | 'revealed';

// Cryptographically fair random integer generator [0, max)
function getSecureRandomInt(max: number): number {
  if (max <= 0) return 0;
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    return array[0] % max;
  }
  return Math.floor(Math.random() * max);
}

export function useFishPond() {
  const [phase, setPhase] = useState<GamePhase>('idle');
  const [approvedChallenges, setApprovedChallenges] = useState<PublicApprovedChallenge[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<PublicApprovedChallenge | null>(null);
  const [lastChallengeId, setLastChallengeId] = useState<string | null>(null);
  const [isLoadingPool, setIsLoadingPool] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [targetFishIndex, setTargetFishIndex] = useState<number>(0);

  const animationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync sound mute state with sound engine
  useEffect(() => {
    sounds.setMuted(!soundEnabled);
  }, [soundEnabled]);

  // Load eligible approved challenges (guaranteeing that caught/shown dares are excluded)
  const fetchApprovedPool = useCallback(async () => {
    setIsLoadingPool(true);
    setError(null);
    const caughtSet = getCaughtChallengeIds();

    if (!isSupabaseConfigured) {
      const all = storageFallback.getChallenges();
      const approvedOnly = all
        .filter((c) => c.status === 'approved' && !caughtSet.has(c.id))
        .map((c) => ({
          id: c.id,
          student_name: c.student_name,
          challenge_text: c.challenge_text,
          category: c.category || 'General Dare',
          created_at: c.created_at,
        }));
      setApprovedChallenges(approvedOnly);
      setIsLoadingPool(false);
      return;
    }

    try {
      const { data, error: err } = await supabase
        .from('challenges')
        .select('id, student_name, challenge_text, created_at')
        .eq('status', 'approved');

      if (err) throw err;
      // Filter out any challenges that have already been caught / displayed on stage
      const remainingPool = ((data || []) as PublicApprovedChallenge[]).filter((c) => !caughtSet.has(c.id));
      setApprovedChallenges(remainingPool);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to load approved challenges.');
    } finally {
      setIsLoadingPool(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovedPool();
  }, [fetchApprovedPool]);

  // Truly random Catch Fish action
  const catchFish = useCallback(() => {
    if (phase !== 'idle') return;

    if (approvedChallenges.length === 0) {
      setError('The pond is waiting for fish! Ask the admin to approve some challenges before playing.');
      return;
    }

    // 1. Pick a truly random approved challenge (ensuring no back-to-back duplicate if > 1 exists)
    let eligiblePool = approvedChallenges;
    if (approvedChallenges.length > 1 && lastChallengeId) {
      const filtered = approvedChallenges.filter((c) => c.id !== lastChallengeId);
      if (filtered.length > 0) {
        eligiblePool = filtered;
      }
    }

    // True cryptographically uniform random selection
    const randomIndex = getSecureRandomInt(eligiblePool.length);
    const chosen = eligiblePool[randomIndex];
    const fishIdx = getSecureRandomInt(6); // Random fish model (0 to 5)
    setTargetFishIndex(fishIdx);

    // PHASE 1 — START: Disable button, play cast sound, drop hook
    setPhase('hooking');
    if (soundEnabled) {
      sounds.playCast();
    }

    // Small delay before splash
    setTimeout(() => {
      if (soundEnabled) {
        sounds.playSplash();
      }
    }, 900);

    // PHASE 2 — 2-SECOND ANIMATION
    animationTimerRef.current = setTimeout(() => {
      // PHASE 3 — FISH CAUGHT
      setCurrentChallenge(chosen);
      setLastChallengeId(chosen.id);
      setPhase('caught');

      if (soundEnabled) {
        sounds.playVictory();
      }

      // Transition to PHASE 4 — CHALLENGE REVEAL (ONCE DISPLAYED, REMOVE FROM POND)
      setTimeout(async () => {
        setPhase('revealed');

        // IMMEDIATELY REMOVE THIS DARE FROM THE ACTIVE POND POOL
        setApprovedChallenges((prev) => prev.filter((c) => c.id !== chosen.id));

        // Persist to caught storage so it is excluded permanently from all future pool refreshes
        saveCaughtChallengeId(chosen.id);

        // Also attempt database/storage sync
        try {
          if (!isSupabaseConfigured) {
            storageFallback.markChallengeCaught(chosen.id);
          } else {
            await supabase.rpc('mark_challenge_caught', { challenge_id: chosen.id });
          }
        } catch (err) {
          console.warn('Database caught status update:', err);
        }
      }, 700);
    }, 2100);
  }, [phase, approvedChallenges, lastChallengeId, soundEnabled]);

  // Next fresher / Reset action
  const resetRound = useCallback(() => {
    if (animationTimerRef.current) {
      clearTimeout(animationTimerRef.current);
    }
    setPhase('idle');
    setCurrentChallenge(null);
    if (soundEnabled) {
      sounds.playBubblePop();
    }
    // Refresh pool in background to catch any newly approved challenges (excluding caught ones)
    fetchApprovedPool();
  }, [soundEnabled, fetchApprovedPool]);

  // Reset all caught challenges back into the pond
  const resetCaughtPool = useCallback(() => {
    resetAllCaughtChallengeIds();
    fetchApprovedPool();
  }, [fetchApprovedPool]);

  const toggleSound = () => {
    setSoundEnabled((prev) => !prev);
    if (!soundEnabled) {
      sounds.setMuted(false);
      sounds.playBubblePop();
    } else {
      sounds.setMuted(true);
    }
  };

  useEffect(() => {
    return () => {
      if (animationTimerRef.current) {
        clearTimeout(animationTimerRef.current);
      }
    };
  }, []);

  return {
    phase,
    approvedChallenges,
    currentChallenge,
    isLoadingPool,
    error,
    soundEnabled,
    targetFishIndex,
    catchFish,
    resetRound,
    resetCaughtPool,
    toggleSound,
    refreshPool: fetchApprovedPool,
  };
}
