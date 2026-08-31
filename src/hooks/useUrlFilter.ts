import { useState, useMemo } from 'react';
import type { ShortUrlResponse } from '../types';
import { isExpired } from '../utils/format';

// ─── useUrlFilter Hook ────────────────────────────────────────────────────────
// Manages live search + tab filter state for the URL table.
// Pure logic — no UI coupling.

type FilterTab = 'all' | 'active' | 'expired';

interface UseUrlFilterReturn {
  filteredUrls: ShortUrlResponse[];
  search: string;
  setSearch: (v: string) => void;
  filter: FilterTab;
  setFilter: (v: FilterTab) => void;
}

export function useUrlFilter(urls: ShortUrlResponse[]): UseUrlFilterReturn {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<FilterTab>('all');

  const filteredUrls = useMemo(() => {
    let result = urls;

    // Tab filter
    if (filter === 'active') {
      result = result.filter((u) => {
        const active = u.active ?? u.isActive;
        return active && !isExpired(u.expiresAt);
      });
    } else if (filter === 'expired') {
      result = result.filter((u) => {
        const active = u.active ?? u.isActive;
        return !active || isExpired(u.expiresAt);
      });
    }

    // Live search — match original URL or short code
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      result = result.filter(
        (u) =>
          u.originalUrl.toLowerCase().includes(q) ||
          u.shortCode.toLowerCase().includes(q),
      );
    }

    return result;
  }, [urls, search, filter]);

  return { filteredUrls, search, setSearch, filter, setFilter };
}
