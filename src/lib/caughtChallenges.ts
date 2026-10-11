const CAUGHT_CHALLENGES_STORAGE_KEY = 'fishpond_caught_challenges_v1';

/**
 * Returns the set of challenge IDs that have already been displayed / caught on stage.
 */
export function getCaughtChallengeIds(): Set<string> {
  if (typeof window === 'undefined') return new Set();
  try {
    const raw = localStorage.getItem(CAUGHT_CHALLENGES_STORAGE_KEY);
    if (!raw) return new Set();
    const arr = JSON.parse(raw);
    return new Set(Array.isArray(arr) ? arr : []);
  } catch {
    return new Set();
  }
}

/**
 * Marks a challenge ID as caught/displayed so it will never be loaded into the pond again.
 */
export function saveCaughtChallengeId(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const set = getCaughtChallengeIds();
    set.add(id);
    localStorage.setItem(CAUGHT_CHALLENGES_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.error('Failed to save caught challenge id:', err);
  }
}

/**
 * Removes a challenge ID from the caught list (e.g. when an admin returns it to the pond).
 */
export function removeCaughtChallengeId(id: string): void {
  if (typeof window === 'undefined' || !id) return;
  try {
    const set = getCaughtChallengeIds();
    set.delete(id);
    localStorage.setItem(CAUGHT_CHALLENGES_STORAGE_KEY, JSON.stringify(Array.from(set)));
  } catch (err) {
    console.error('Failed to remove caught challenge id:', err);
  }
}

/**
 * Resets all caught challenges back into the pond.
 */
export function resetAllCaughtChallengeIds(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(CAUGHT_CHALLENGES_STORAGE_KEY);
  } catch (err) {
    console.error('Failed to reset caught challenges:', err);
  }
}
