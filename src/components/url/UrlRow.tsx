import { useState } from 'react';
import type { ShortUrlResponse } from '../../types';
import { Badge } from '../common/Badge';
import { CopyButton } from '../common/CopyButton';
import { FaviconImg } from '../common/FaviconImg';
import { truncateUrl, formatCount, isExpired, isExpiringSoon, getDomain } from '../../utils/format';

// ─── UrlRow Component ─────────────────────────────────────────────────────────

interface UrlRowProps {
  url: ShortUrlResponse;
  onEdit: () => void;
  onDelete: () => void;
  onAnalytics: () => void;
}

export function UrlRow({ url, onEdit, onDelete, onAnalytics }: UrlRowProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [showQr, setShowQr] = useState(false);

  const expired = isExpired(url.expiresAt);
  const expiringSoon = !expired && isExpiringSoon(url.expiresAt);
  const isActive = url.active ?? url.isActive;

  let badgeVariant: 'active' | 'expired' | 'inactive' | 'warning' | 'neutral';
  if (!isActive) {
    badgeVariant = 'inactive';
  } else if (expired) {
    badgeVariant = 'expired';
  } else if (expiringSoon) {
    badgeVariant = 'warning';
  } else {
    badgeVariant = 'active';
  }

  const clicks = url.totalClicks ?? url.clickCount ?? 0;
  const domain = getDomain(url.originalUrl);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete();
  };

  return (
    <>
      <tr className="border-b border-border hover:bg-muted-light/60 transition-colors">
        {/* Original URL */}
        <td className="px-5 py-3">
          <div className="flex items-center gap-2">
            <FaviconImg domain={domain} className="opacity-70" />
            <a
              href={url.originalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-blue transition-colors no-underline font-normal"
              title={url.originalUrl}
            >
              {truncateUrl(url.originalUrl, 52)}
            </a>
          </div>
        </td>

        {/* Short code */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs text-accent bg-muted-light border border-border px-2 py-0.5 rounded">
              {url.shortCode}
            </span>
            <CopyButton text={url.shortUrl} size="sm" />
          </div>
        </td>

        {/* Clicks */}
        <td className="px-4 py-3 text-sm text-muted tabular-nums">
          {formatCount(clicks)}
        </td>

        {/* Status */}
        <td className="px-4 py-3">
          <Badge variant={badgeVariant} />
        </td>

        {/* Actions */}
        <td className="px-4 py-3">
          <div className="flex items-center gap-1 justify-end">
            <button
              onClick={onAnalytics}
              className="px-2.5 py-1 text-xs font-medium text-muted border border-border rounded
                         hover:text-accent hover:border-accent transition-colors"
              title="View analytics"
            >
              Stats
            </button>
            {url.qrCodeBase64 && (
              <button
                onClick={() => setShowQr((v) => !v)}
                className={[
                  'px-2.5 py-1 text-xs font-medium border rounded transition-colors',
                  showQr
                    ? 'border-accent-blue text-accent-blue bg-blue-50'
                    : 'text-muted border-border hover:text-accent hover:border-accent',
                ].join(' ')}
                title="Show QR code"
              >
                QR
              </button>
            )}
            <button
              onClick={onEdit}
              className="px-2.5 py-1 text-xs font-medium text-muted border border-border rounded
                         hover:text-accent hover:border-accent transition-colors"
              title="Edit link"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              className={[
                'px-2.5 py-1 text-xs font-medium border rounded transition-colors',
                confirmDelete
                  ? 'text-white bg-danger border-danger'
                  : 'text-muted border-border hover:text-danger hover:border-danger',
              ].join(' ')}
              title={confirmDelete ? 'Click again to confirm deletion' : 'Delete link'}
            >
              {confirmDelete ? 'Confirm?' : 'Delete'}
            </button>
          </div>
        </td>
      </tr>

      {/* QR Code expanded row */}
      {showQr && url.qrCodeBase64 && (
        <tr className="border-b border-border bg-muted-light/40">
          <td colSpan={5} className="px-5 py-3">
            <div className="flex items-center gap-4">
              <img
                src={url.qrCodeBase64}
                alt={`QR for ${url.shortCode}`}
                className="w-20 h-20 border border-border rounded"
              />
              <div>
                <p className="text-xs font-medium text-accent mb-1">
                  QR Code — <span className="font-mono">{url.shortUrl}</span>
                </p>
                <a
                  href={url.qrCodeBase64}
                  download={`qr-${url.shortCode}.png`}
                  className="text-xs text-accent-blue hover:underline"
                >
                  Download PNG
                </a>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

