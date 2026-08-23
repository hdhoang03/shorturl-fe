import { useState } from 'react';

// ─── CopyButton Component ─────────────────────────────────────────────────────

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
}

export function CopyButton({ text, size = 'md' }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const sizeClass = size === 'sm' ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-xs';

  return (
    <button
      onClick={handleCopy}
      className={[
        'font-medium border rounded transition-all duration-150 cursor-pointer',
        sizeClass,
        copied
          ? 'bg-green-50 text-success border-green-200'
          : 'bg-white text-muted border-border hover:border-accent hover:text-accent',
      ].join(' ')}
      title="Copy to clipboard"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  );
}
