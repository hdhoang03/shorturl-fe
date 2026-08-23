import { useState, useEffect, useCallback } from 'react';
import { getBatchUrls } from '../api/urlApi';
import type { ShortUrlResponse } from '../types';

const STORAGE_KEY = 'shorturl_codes';

// ─── useUrls Hook ─────────────────────────────────────────────────────────────
// Manages the list of short codes stored in localStorage.
// On mount, fetches full details via batch API.

export function useUrls() {
  const [urls, setUrls] = useState<ShortUrlResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Read stored codes from localStorage
  const getStoredCodes = (): string[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  };

  // Write codes to localStorage
  const saveCodes = (codes: string[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(codes));
  };

  // Fetch all stored URLs from backend
  const refresh = useCallback(async () => {
    const codes = getStoredCodes();
    if (codes.length === 0) {
      setUrls([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getBatchUrls(codes);
      setUrls(data);
    } catch {
      setError('Failed to load your links. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Add a newly created short URL to local state and storage
  const addUrl = useCallback((newUrl: ShortUrlResponse) => {
    const codes = getStoredCodes();
    if (!codes.includes(newUrl.shortCode)) {
      saveCodes([newUrl.shortCode, ...codes]);
    }
    setUrls((prev) => {
      const exists = prev.find((u) => u.shortCode === newUrl.shortCode);
      if (exists) return prev;
      return [newUrl, ...prev];
    });
  }, []);

  // Update an existing URL in local state
  const updateUrlInList = useCallback((updated: ShortUrlResponse) => {
    setUrls((prev) =>
      prev.map((u) => (u.shortCode === updated.shortCode ? updated : u))
    );
  }, []);

  // Remove a URL from local state and storage
  const removeUrl = useCallback((shortCode: string) => {
    const codes = getStoredCodes().filter((c) => c !== shortCode);
    saveCodes(codes);
    setUrls((prev) => prev.filter((u) => u.shortCode !== shortCode));
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { urls, loading, error, refresh, addUrl, updateUrlInList, removeUrl };
}
