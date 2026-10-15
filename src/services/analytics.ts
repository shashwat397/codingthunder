import { track } from '@vercel/analytics';

/**
 * Helper to record custom analytics events to Vercel Web Analytics.
 * In environments where Vercel Analytics is disabled or running locally,
 * this function gracefully succeeds without throwing.
 */
export function trackEvent(
  eventName: string,
  properties?: Record<string, string | number | boolean | null>
): void {
  try {
    track(eventName, properties);
  } catch (err) {
    // Graceful fallback for non-production environments
    console.debug('[Vercel Analytics]', eventName, properties);
  }
}
