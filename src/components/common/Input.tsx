import type { InputHTMLAttributes } from 'react';

// ─── Input Component ──────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
}

export function Input({ label, error, hint, id, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={id} className="text-xs font-medium text-accent">
          {label}
        </label>
      )}
      <input
        id={id}
        className={[
          'w-full px-3 py-2 text-sm border rounded bg-white text-accent placeholder:text-muted',
          'focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors',
          error ? 'border-danger' : 'border-border',
          className,
        ].join(' ')}
        {...props}
      />
      {hint && !error && <p className="text-xs text-muted">{hint}</p>}
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
