import { useState, type FormEvent } from 'react';
import { shortenUrl } from '../../api/urlApi';
import type { ShortUrlResponse, ShortenUrlRequest } from '../../types';
import { Input } from '../common/Input';
import { Button } from '../common/Button';

// ─── ShortenForm Component ────────────────────────────────────────────────────

interface ShortenFormProps {
  onSuccess: (result: ShortUrlResponse) => void;
}

const EXPIRY_OPTIONS = [
  { label: 'No expiry', value: '' },
  { label: '1 day', value: '1' },
  { label: '7 days', value: '7' },
  { label: '30 days', value: '30' },
  { label: '90 days', value: '90' },
];

const canPaste = typeof navigator !== 'undefined' && 'clipboard' in navigator;

export function ShortenForm({ onSuccess }: ShortenFormProps) {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [expiry, setExpiry] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setUrl(text.trim());
    } catch {
      // Silently fail if clipboard permission denied
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError(null);

    const body: ShortenUrlRequest = {
      originalUrl: url.trim(),
      ...(alias.trim() && { customAlias: alias.trim() }),
      ...(expiry && { expiresInDays: Number(expiry) }),
    };

    try {
      const result = await shortenUrl(body);
      onSuccess(result);
      setUrl('');
      setAlias('');
      setExpiry('');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setError(msg ?? 'Failed to shorten URL. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-white border border-border rounded-lg p-6 shadow-card">
      <h1 className="text-xl font-semibold text-accent mb-1">Shorten your URL</h1>
      <p className="text-sm text-muted mb-5">
        Paste a long URL below to generate a short, trackable link.
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        {/* Main URL input + Paste button */}
        <div className="flex flex-col gap-1">
          <label htmlFor="url-input" className="text-xs font-medium text-accent">
            Long URL
          </label>
          <div className="flex gap-2">
            <input
              id="url-input"
              type="url"
              placeholder="https://your-very-long-url.com/with/a/long/path"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              disabled={loading}
              className="flex-1 px-3 py-2 text-sm border border-border rounded bg-white text-accent
                         placeholder:text-muted focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors"
            />
            {canPaste && (
              <button
                type="button"
                onClick={handlePaste}
                disabled={loading}
                className="px-3 py-2 text-xs font-medium text-muted border border-border rounded
                           hover:text-accent hover:border-accent transition-colors cursor-pointer disabled:opacity-40 whitespace-nowrap"
                title="Paste from clipboard"
              >
                Paste
              </button>
            )}
          </div>
        </div>

        {/* Options row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            id="alias-input"
            label="Custom alias (optional)"
            type="text"
            placeholder="my-custom-slug"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            disabled={loading}
            hint="Leave blank for a random code"
          />

          <div className="flex flex-col gap-1">
            <label htmlFor="expiry-select" className="text-xs font-medium text-accent">
              Expires in
            </label>
            <select
              id="expiry-select"
              value={expiry}
              onChange={(e) => setExpiry(e.target.value)}
              disabled={loading}
              className="w-full px-3 py-2 text-sm border border-border rounded bg-white text-accent
                         focus:border-accent-blue focus:ring-1 focus:ring-accent-blue/20 transition-colors"
            >
              {EXPIRY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <p className="animate-slide-in text-xs text-danger bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}

        {/* Submit */}
        <div className="flex justify-end">
          <Button type="submit" variant="primary" size="md" loading={loading}>
            Shorten
          </Button>
        </div>
      </form>
    </section>
  );
}

