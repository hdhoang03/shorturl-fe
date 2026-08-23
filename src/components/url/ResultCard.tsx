import { useState } from 'react';
import type { ShortUrlResponse } from '../../types';
import { CopyButton } from '../common/CopyButton';

// ─── ResultCard Component ─────────────────────────────────────────────────────
// Shows the newly created short URL with copy, open, and QR code display.

interface ResultCardProps {
  result: ShortUrlResponse;
}

export function ResultCard({ result }: ResultCardProps) {
  const [showQr, setShowQr] = useState(false);

  return (
    <div className="bg-white border border-accent-blue/20 rounded-lg px-5 py-4">
      <p className="text-xs text-muted mb-2 font-medium uppercase tracking-wide">
        Your link is ready
      </p>

      <div className="flex items-start gap-4">
        {/* Left: link + actions */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3 flex-wrap">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-semibold text-accent-blue break-all"
            >
              {result.shortUrl}
            </a>

            <div className="flex items-center gap-2 shrink-0">
              <CopyButton text={result.shortUrl} size="md" />
              <a
                href={result.shortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs font-medium border border-border rounded text-muted
                           hover:text-accent hover:border-accent transition-colors no-underline"
              >
                Open
              </a>
              {result.qrCodeBase64 && (
                <button
                  onClick={() => setShowQr((v) => !v)}
                  className={[
                    'px-3 py-1.5 text-xs font-medium border rounded transition-colors',
                    showQr
                      ? 'border-accent-blue text-accent-blue bg-blue-50'
                      : 'border-border text-muted hover:text-accent hover:border-accent',
                  ].join(' ')}
                >
                  {showQr ? 'Hide QR' : 'QR Code'}
                </button>
              )}
            </div>
          </div>

          <p className="text-xs text-muted mt-2 truncate">
            Original: <span className="text-accent">{result.originalUrl}</span>
          </p>
        </div>
      </div>

      {/* QR Code panel */}
      {showQr && result.qrCodeBase64 && (
        <div className="mt-4 pt-4 border-t border-border flex items-start gap-4">
          <img
            src={result.qrCodeBase64}
            alt={`QR code for ${result.shortUrl}`}
            className="w-36 h-36 border border-border rounded"
          />
          <div className="flex flex-col gap-2">
            <p className="text-xs font-medium text-accent">QR Code</p>
            <p className="text-xs text-muted">
              Scan to open <strong>{result.shortUrl}</strong>
            </p>
            <a
              href={result.qrCodeBase64}
              download={`qr-${result.shortCode}.png`}
              className="px-3 py-1.5 text-xs font-medium border border-border rounded text-muted
                         hover:text-accent hover:border-accent transition-colors no-underline inline-block w-fit"
            >
              Download PNG
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
