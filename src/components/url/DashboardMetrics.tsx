import type { ShortUrlResponse } from '../../types';
import { isExpired } from '../../utils/format';

// ─── DashboardMetrics Component ───────────────────────────────────────────────
// Compact inline stats: Total / Active / Expired
// No icons — just clean data.

interface DashboardMetricsProps {
  urls: ShortUrlResponse[];
}

export function DashboardMetrics({ urls }: DashboardMetricsProps) {
  const total = urls.length;
  const active = urls.filter((u) => {
    const isActive = u.active ?? u.isActive;
    return isActive && !isExpired(u.expiresAt);
  }).length;
  const expired = total - active;

  const metrics: { label: string; value: number }[] = [
    { label: 'Total', value: total },
    { label: 'Active', value: active },
    { label: 'Expired', value: expired },
  ];

  return (
    <dl className="flex items-center gap-3 sm:gap-4">
      {metrics.map(({ label, value }, i) => (
        <div key={label} className="flex items-baseline gap-1">
          {i > 0 && (
            <span className="text-border select-none mr-1 hidden sm:inline" aria-hidden="true">
              /
            </span>
          )}
          <dt className="text-xs text-muted">{label}</dt>
          <dd className="text-xs font-semibold text-accent tabular-nums">{value}</dd>
        </div>
      ))}
    </dl>
  );
}
