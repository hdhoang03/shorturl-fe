import type { ShortUrlResponse } from '../../types';
import { UrlRow } from './UrlRow';
import { Button } from '../common/Button';

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

export function UrlTable({
  urls,
  loading,
  error,
  onRefresh,
  onEdit,
  onDelete,
  onAnalytics,
}: UrlTableProps) {
  return (
    <section id="history" className="bg-white border border-border rounded-lg">
      {/* Table header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h2 className="text-sm font-semibold text-accent">Your links</h2>
        <Button variant="ghost" size="sm" onClick={onRefresh} loading={loading}>
          Refresh
        </Button>
      </div>

      {/* Error state */}
      {error && (
        <div className="px-5 py-4 text-sm text-danger">{error}</div>
      )}

      {/* Empty state */}
      {!loading && !error && urls.length === 0 && (
        <div className="px-5 py-12 text-center">
          <p className="text-sm text-muted">No links yet. Shorten a URL above to get started.</p>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && urls.length === 0 && (
        <div className="px-5 py-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-10 bg-muted-light rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Table */}
      {urls.length > 0 && (
        <div className="overflow-x-auto">
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
              {urls.map((url) => (
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
      )}
    </section>
  );
}
