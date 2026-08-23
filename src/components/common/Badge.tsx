// ─── Badge Component ──────────────────────────────────────────────────────────

type BadgeVariant = 'active' | 'expired' | 'inactive' | 'neutral';

interface BadgeProps {
  variant: BadgeVariant;
  label?: string;
}

const styles: Record<BadgeVariant, string> = {
  active: 'bg-green-50 text-success border border-green-200',
  expired: 'bg-red-50 text-danger border border-red-200',
  inactive: 'bg-gray-100 text-muted border border-border',
  neutral: 'bg-muted-light text-muted border border-border',
};

const labels: Record<BadgeVariant, string> = {
  active: 'Active',
  expired: 'Expired',
  inactive: 'Inactive',
  neutral: 'Unknown',
};

export function Badge({ variant, label }: BadgeProps) {
  return (
    <span
      className={[
        'inline-block px-2 py-0.5 text-xs font-medium rounded',
        styles[variant],
      ].join(' ')}
    >
      {label ?? labels[variant]}
    </span>
  );
}
