// ─── StatCard Component ───────────────────────────────────────────────────────

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
}

export function StatCard({ label, value, sub }: StatCardProps) {
  return (
    <div className="border border-border rounded p-4 bg-white">
      <p className="text-xs text-muted mb-1">{label}</p>
      <p className="text-2xl font-semibold text-accent">{value}</p>
      {sub && <p className="text-xs text-muted mt-0.5">{sub}</p>}
    </div>
  );
}
