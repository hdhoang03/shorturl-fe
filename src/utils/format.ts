// ─── Date / Time Formatters ───────────────────────────────────────────────────

/**
 * Format ISO date string to "DD MMM YYYY"
 * e.g. "23 Aug 2026"
 */
export function formatDate(iso: string | null | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Format ISO date string to relative time
 * e.g. "3 hours ago", "just now"
 */
export function formatRelative(iso: string | null | undefined): string {
  if (!iso) return '—';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

// ─── URL Helpers ──────────────────────────────────────────────────────────────

/**
 * Truncate a URL to a max character length, showing ellipsis
 */
export function truncateUrl(url: string, maxLen = 60): string {
  if (url.length <= maxLen) return url;
  return url.slice(0, maxLen) + '…';
}

/**
 * Strip protocol from URL for display
 * "https://example.com/path" → "example.com/path"
 */
export function stripProtocol(url: string): string {
  return url.replace(/^https?:\/\//, '');
}

/**
 * Determine if a short URL is expired based on expiresAt field
 */
export function isExpired(expiresAt: string | null): boolean {
  if (!expiresAt) return false;
  return new Date(expiresAt).getTime() < Date.now();
}

// ─── Number Formatters ────────────────────────────────────────────────────────

/**
 * Format large numbers: 1200 → "1.2K"
 */
export function formatCount(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}
