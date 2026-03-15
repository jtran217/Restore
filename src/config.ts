/**
 * Configurable limits for focus / notification behavior.
 * Override at runtime via localStorage for testing (e.g. in DevTools):
 *   localStorage.setItem('flow-max-minutes-on-site', '2')
 */

const STORAGE_KEY_MAX_MINUTES_ON_SITE = 'flow-max-minutes-on-site';

/** Default: notify after 15 minutes on the same site. Use 2–3 for testing. */
const DEFAULT_MAX_MINUTES_ON_SITE = 1;

export function getMaxMinutesOnSite(): number {
  try {
    const v = localStorage.getItem(STORAGE_KEY_MAX_MINUTES_ON_SITE);
    if (v != null) {
      const n = parseInt(v, 10);
      if (Number.isFinite(n) && n >= 1) return Math.min(n, 120);
    }
  } catch {
    // ignore
  }
  return DEFAULT_MAX_MINUTES_ON_SITE;
}
