import { useEffect } from 'react';
import { useAnalytics } from '../../hooks/useAnalytics';
import { Modal } from '../common/Modal';
import { StatCard } from './StatCard';
import { BarChart } from './BarChart';
import { formatDate, formatCount } from '../../utils/format';
import type { BarItem } from '../../types';

// ─── AnalyticsModal Component ─────────────────────────────────────────────────
// Backend returns Map<String, Long> for breakdowns (clicksByDevice, etc.)
// We convert them to BarItem[] for the chart.

interface AnalyticsModalProps {
  shortCode: string | null;
  open: boolean;
  onClose: () => void;
}

/** Convert backend Map<String, Long> to BarItem[] with percentages */
function mapToBarItems(map: Record<string, number>): BarItem[] {
  const entries = Object.entries(map);
  const total = entries.reduce((sum, [, v]) => sum + v, 0);
  if (total === 0) return [];
  return entries
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      label,
      count,
      percentage: Math.round((count / total) * 100),
    }));
}

export function AnalyticsModal({ shortCode, open, onClose }: AnalyticsModalProps) {
  const { data, loading, error, fetch, reset } = useAnalytics();

  useEffect(() => {
    if (open && shortCode) fetch(shortCode);
    if (!open) reset();
  }, [open, shortCode, fetch, reset]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={shortCode ? `Analytics — ${shortCode}` : 'Analytics'}
      width="max-w-2xl"
    >
      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-muted-light rounded animate-pulse" />
          ))}
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <p className="text-sm text-danger">{error}</p>
      )}

      {/* Data view */}
      {data && !loading && (
        <div className="flex flex-col gap-6">
          {/* Top stat cards */}
          <div className="grid grid-cols-3 gap-3">
            <StatCard
              label="Total Clicks"
              value={formatCount(data.totalClicks)}
            />
            <StatCard
              label="Unique Visitors"
              value={formatCount(data.uniqueVisitors)}
            />
            <StatCard
              label="Created"
              value={formatDate(data.createdAt)}
            />
          </div>

          {/* Breakdown charts */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 border-t border-border">
            <BarChart
              title="Device"
              items={mapToBarItems(data.clicksByDevice ?? {})}
            />
            <BarChart
              title="Browser"
              items={mapToBarItems(data.clicksByBrowser ?? {})}
            />
            <BarChart
              title="OS"
              items={mapToBarItems(data.clicksByOs ?? {})}
            />
          </div>

          {/* Referrers */}
          {Object.keys(data.clicksByReferer ?? {}).length > 0 && (
            <div className="pt-2 border-t border-border">
              <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">
                Top Referrers
              </p>
              <div className="flex flex-wrap gap-2">
                {Object.entries(data.clicksByReferer)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 8)
                  .map(([ref, count]) => (
                    <span
                      key={ref}
                      className="flex items-center gap-1.5 px-2.5 py-1 text-xs border border-border rounded bg-muted-light text-accent"
                    >
                      <span className="truncate max-w-[120px]">{ref || 'Direct'}</span>
                      <span className="text-muted font-mono shrink-0">{count}</span>
                    </span>
                  ))}
              </div>
            </div>
          )}

          {/* Clicks by Date (simple) */}
          {Object.keys(data.clicksByDate ?? {}).length > 0 && (
            <div className="pt-2 border-t border-border">
              <BarChart
                title="Clicks by Date"
                items={mapToBarItems(data.clicksByDate ?? {})}
                maxItems={7}
              />
            </div>
          )}
        </div>
      )}
    </Modal>
  );
}
