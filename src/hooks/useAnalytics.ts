import { useState, useCallback } from 'react';
import { getAnalytics } from '../api/urlApi';
import type { ClickAnalyticsResponse } from '../types';

// ─── useAnalytics Hook ────────────────────────────────────────────────────────
// Fetches analytics for a given short code on demand.
// Backend returns Map<String, Long> shape for breakdown data.

export function useAnalytics() {
  const [data, setData] = useState<ClickAnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async (shortCode: string) => {
    setLoading(true);
    setError(null);
    setData(null);
    try {
      const result = await getAnalytics(shortCode);
      setData(result);
    } catch {
      setError('Failed to load analytics data.');
    } finally {
      setLoading(false);
    }
  }, []);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return { data, loading, error, fetch, reset };
}
