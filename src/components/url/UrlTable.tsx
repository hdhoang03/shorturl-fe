import type { ShortUrlResponse } from '../../types';
import { UrlRow } from './UrlRow';
import { Button } from '../common/Button';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { FaviconImg } from '../common/FaviconImg';
import { DashboardMetrics } from './DashboardMetrics';
import { useUrlFilter } from '../../hooks/useUrlFilter';
import { useState } from 'react';
import {
  truncateUrl,
  formatCount,
  isExpired,
  isExpiringSoon,
  getDomain,
} from '../../utils/format';

// ─── UrlTable Component ───────────────────────────────────────────────────────

interface UrlTableProps {
  urls: ShortUrlResponse[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onEdit: (url: ShortUrlResponse) => void;
  onDelete: (shortCode: string) => void;
  onAnalytics: (shortCode: string) => void;
}

const FILTER_TABS = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'expired', label: 'Expired' },
] as const;

// ─── Mobile card for a single URL ─────────────────────────────────────────────

function MobileUrlCard({
  url,
  onEdit,
  onDelete,
  onAnalytics,
}: {
  url: ShortUrlResponse;
  onEdit: () => void;
  onDelete: () => void;
  onAnalytics: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const expired = isExpired(url.expiresAt);
  const expiringSoon = !expired && isExpiringSoon(url.expiresAt);
  const isActive = url.active ?? url.isActive;
  const clicks = url.totalClicks ?? url.clickCount ?? 0;
  const domain = getDomain(url.originalUrl);

  let badgeVariant: 'active' | 'expired' | 'inactive' | 'warning' | 'neutral';
  if (!isActive) badgeVariant = 'inactive';
  else if (expired) badgeVariant = 'expired';
  else if (expiringSoon) badgeVariant = 'warning';
  else badgeVariant = 'active';

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete();
  };

  return (
    <div className="px-4 py-3.5 border-b border-border last:border-b-0">
      {/* Top row: favicon + original URL + badge */}
      <div className="flex items-start gap-2 mb-2">
        <FaviconImg domain={domain} className="opacity-70 mt-0.5 shrink-0" />
        <a
          href={url.originalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 text-sm text-accent hover:text-accent-blue no-underline truncate leading-snug"
          title={url.originalUrl}
        >
          {truncateUrl(url.originalUrl, 45)}
        </a>
        <Badge variant={badgeVariant} />
      </div>

      {/* Short code + copy */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-mono text-xs text-accent bg-muted-light border border-border px-2 py-0.5 rounded">
          {url.shortCode}
        </span>
        <CopyButton text={url.shortUrl} size="sm" />
        <span className="text-xs text-muted tabular-nums ml-auto">{formatCount(clicks)} clicks</span>
      </div>

      {/* Action row */}
      <div className="flex items-center gap-1.5">
        <button
          onClick={onAnalytics}
          className="px-2.5 py-1 text-xs font-medium text-muted border border-border rounded hover:text-accent hover:border-accent transition-colors"
        >
          Stats
        </button>
        <button
          onClick={onEdit}
          className="px-2.5 py-1 text-xs font-medium text-muted border border-border rounded hover:text-accent hover:border-accent transition-colors"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          className={[
            'px-2.5 py-1 text-xs font-medium border rounded transition-colors',
            confirmDelete
              ? 'text-white bg-danger border-danger'
              : 'text-muted border-border hover:text-danger hover:border-danger',
          ].join(' ')}
        >
          {confirmDelete ? 'Confirm?' : 'Delete'}
        </button>
      </div>
    </div>
  );
}

// ─── Main Table Component ──────────────────────────────────────────────────────

export function UrlTable({
  urls,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onAnalytics,
}: UrlTableProps) {
  const { filteredUrls, search, setSearch, filter, setFilter } = useUrlFilter(urls);

  return (
    <section id="history" className="bg-white border border-border rounded-lg shadow-card">
      {/* Header bar: title + metrics + controls */}
      <div className="px-4 sm:px-5 py-3 border-b border-border">
        {/* Row 1: title + metrics + refresh */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3 min-w-0">
            <h2 className="text-sm font-semibold text-accent shrink-0">Your links</h2>
            {urls.length > 0 && <DashboardMetrics urls={urls} />}
          </div>
          <Button variant="ghost" size="sm" onClick={onRefresh} loading={loading}>
            Refresh
          </Button>
        </div>

        {/* Row 2: filter tabs + search (only when there are links) */}
        {urls.length > 0 && (
          <div className="flex items-center gap-2">
            <div className="flex items-center">
              {FILTER_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setFilter(tab.value)}
                  className={[
                    'px-2.5 py-1 text-xs font-medium transition-colors cursor-pointer border-b-2',
                    filter === tab.value
                      ? 'text-accent border-accent'
                      : 'text-muted border-transparent hover:text-accent',
                  ].join(' ')}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            <input
              type="search"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="ml-auto w-32 sm:w-40 px-2.5 py-1 text-xs border border-border rounded bg-white text-accent
                         placeholder:text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors"
              aria-label="Search links"
            />
          </div>
        )}
      </div>

      {/* Error state */}
      {error && (
        <div className="px-4 sm:px-5 py-4 text-sm text-danger">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && urls.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-muted">No links yet. Shorten a URL above to get started.</p>
        </div>
      )}

      {/* No results from filter/search */}
      {!loading && !error && urls.length > 0 && filteredUrls.length === 0 && (
        <div className="px-5 py-8 text-center">
          <p className="text-sm text-muted">No links match your search.</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && urls.length === 0 && (
        <div className="px-4 sm:px-5 py-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 sm:h-10 bg-muted-light rounded animate-pulse" />
          ))}
        </div>
      )}

      {filteredUrls.length > 0 && (
        <>
          {/* ── Mobile card list (< sm) ── */}
          <div className="sm:hidden">
            {filteredUrls.map((url) => (
              <MobileUrlCard
                key={url.shortCode}
                url={url}
                onEdit={() => onEdit(url)}
                onDelete={() => onDelete(url.shortCode)}
                onAnalytics={() => onAnalytics(url.shortCode)}
              />
            ))}
          </div>

          {/* ── Desktop table (sm+) ── */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Original URL
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Short code
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Clicks
                  </th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">
                    Status
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filteredUrls.map((url) => (
                  <UrlRow
                    key={url.shortCode}
                    url={url}
                    onEdit={() => onEdit(url)}
                    onDelete={() => onDelete(url.shortCode)}
                    onAnalytics={() => onAnalytics(url.shortCode)}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </section>
  );
}
