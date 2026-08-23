import { useState, useEffect, type FormEvent } from 'react';
import { updateUrl } from '../../api/urlApi';
import type { ShortUrlResponse, UpdateUrlRequest } from '../../types';
import { Modal } from '../common/Modal';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

// ─── EditModal Component ──────────────────────────────────────────────────────

interface EditModalProps {
  url: ShortUrlResponse | null;
  open: boolean;
  onClose: () => void;
  onUpdated: (updated: ShortUrlResponse) => void;
}

export function EditModal({ url, open, onClose, onUpdated }: EditModalProps) {
  const [originalUrl, setOriginalUrl] = useState('');
  const [expiresInDays, setExpiresInDays] = useState('');
  const [active, setActive] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync form with selected URL when modal opens
  useEffect(() => {
    if (url) {
      setOriginalUrl(url.originalUrl);
      setActive(url.active);
      setExpiresInDays('');
      setError(null);
    }
  }, [url]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError(null);

    const body: UpdateUrlRequest = {
      originalUrl: originalUrl.trim() || undefined,
      active,
      ...(expiresInDays ? { expiresInDays: Number(expiresInDays) } : {}),
    };

    try {
      const updated = await updateUrl(url.shortCode, body);
      onUpdated(updated);
      onClose();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!url) return null;

  return (
    <Modal open={open} onClose={onClose} title={`Edit — ${url.shortCode}`}>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="edit-original-url"
          label="Target URL"
          type="url"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          disabled={loading}
          required
        />

        <Input
          id="edit-expiry"
          label="Extend expiry (days from now)"
          type="number"
          min="1"
          placeholder="e.g. 30"
          value={expiresInDays}
          onChange={(e) => setExpiresInDays(e.target.value)}
          disabled={loading}
          hint="Leave blank to keep current expiry"
        />

        {/* Active toggle */}
        <div className="flex items-center gap-3">
          <label
            htmlFor="edit-active"
            className="text-xs font-medium text-accent cursor-pointer select-none"
          >
            Active
          </label>
          <button
            id="edit-active"
            type="button"
            role="switch"
            aria-checked={active}
            onClick={() => setActive((v) => !v)}
            disabled={loading}
            className={[
              'relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-200',
              active ? 'bg-accent-blue' : 'bg-border',
            ].join(' ')}
          >
            <span
              className={[
                'inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform duration-200',
                active ? 'translate-x-4' : 'translate-x-1',
              ].join(' ')}
            />
          </button>
          <span className="text-xs text-muted">{active ? 'Enabled' : 'Disabled'}</span>
        </div>

        {error && (
          <p className="text-xs text-danger bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm" loading={loading}>
            Save changes
          </Button>
        </div>
      </form>
    </Modal>
  );
}
