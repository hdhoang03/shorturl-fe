// ─── BarChart Component ───────────────────────────────────────────────────────
// Pure CSS horizontal bar chart — no external chart library needed.

interface BarItem {
  label: string;
  count: number;
  percentage: number;
}

interface BarChartProps {
  title: string;
  items: BarItem[];
  maxItems?: number;
}

const BAR_COLORS = [
  'bg-accent-blue',
  'bg-blue-400',
  'bg-blue-300',
  'bg-blue-200',
  'bg-blue-100',
];

export function BarChart({ title, items, maxItems = 5 }: BarChartProps) {
  const displayed = items.slice(0, maxItems);

  return (
    <div>
      <p className="text-xs font-semibold text-muted uppercase tracking-wide mb-3">{title}</p>
      {displayed.length === 0 ? (
        <p className="text-xs text-muted">No data</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {displayed.map((item, i) => (
            <div key={item.label}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs text-accent truncate max-w-[130px]">{item.label}</span>
                <span className="text-xs text-muted shrink-0 ml-2">
                  {item.count} ({item.percentage}%)
                </span>
              </div>
              <div className="h-1.5 bg-muted-light rounded-full overflow-hidden">
                <div
                  className={['h-full rounded-full transition-all', BAR_COLORS[i] ?? 'bg-blue-100'].join(' ')}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
