import type { ButtonHTMLAttributes } from 'react';

// ─── Button Variants ──────────────────────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-accent-blue text-white hover:bg-accent-blue-hover border border-transparent disabled:opacity-50',
  secondary:
    'bg-white text-accent border border-border hover:bg-muted-light disabled:opacity-50',
  ghost:
    'bg-transparent text-muted hover:text-accent hover:bg-muted-light border border-transparent disabled:opacity-40',
  danger:
    'bg-white text-danger border border-danger hover:bg-red-50 disabled:opacity-50',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-2.5 text-sm',
};

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={[
        'inline-flex items-center justify-center gap-2 font-medium rounded transition-colors duration-150 cursor-pointer select-none whitespace-nowrap',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      {...props}
    >
      {loading ? (
        <span className="inline-block w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : null}
      {children}
    </button>
  );
}
