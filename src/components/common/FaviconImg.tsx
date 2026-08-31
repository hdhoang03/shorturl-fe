// ─── FaviconImg Component ─────────────────────────────────────────────────────
// Renders a 16×16 favicon for a given domain URL.
// Falls back silently (renders nothing) if the image fails to load.

interface FaviconImgProps {
  domain: string;
  className?: string;
}

export function FaviconImg({ domain, className = '' }: FaviconImgProps) {
  if (!domain) return null;

  const src = `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;

  return (
    <img
      src={src}
      alt=""
      aria-hidden="true"
      width={16}
      height={16}
      className={`inline-block shrink-0 ${className}`}
      onError={(e) => {
        // Hide on load failure — no broken icon
        (e.currentTarget as HTMLImageElement).style.display = 'none';
      }}
    />
  );
}
