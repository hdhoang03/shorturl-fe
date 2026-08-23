import { useState } from 'react';
import { Layout } from '../components/layout/Layout';
import { ShortenForm } from '../components/url/ShortenForm';
import { ResultCard } from '../components/url/ResultCard';
import { UrlTable } from '../components/url/UrlTable';
import { EditModal } from '../components/url/EditModal';
import { AnalyticsModal } from '../components/analytics/AnalyticsModal';
import { deleteUrl } from '../api/urlApi';
import { useUrls } from '../hooks/useUrls';
import type { ShortUrlResponse } from '../types';

// ─── HomePage ─────────────────────────────────────────────────────────────────

export function HomePage() {
  const { urls, loading, error, refresh, addUrl, updateUrlInList, removeUrl } = useUrls();

  // Latest shortened result
  const [result, setResult] = useState<ShortUrlResponse | null>(null);

  // Edit modal state
  const [editTarget, setEditTarget] = useState<ShortUrlResponse | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  // Analytics modal state
  const [analyticsCode, setAnalyticsCode] = useState<string | null>(null);
  const [analyticsOpen, setAnalyticsOpen] = useState(false);

  const handleShortenSuccess = (newUrl: ShortUrlResponse) => {
    setResult(newUrl);
    addUrl(newUrl);
  };

  const handleEdit = (url: ShortUrlResponse) => {
    setEditTarget(url);
    setEditOpen(true);
  };

  const handleDelete = async (shortCode: string) => {
    try {
      await deleteUrl(shortCode);
      removeUrl(shortCode);
      if (result?.shortCode === shortCode) setResult(null);
    } catch {
      // Silently fail; row stays in table
    }
  };

  const handleAnalytics = (shortCode: string) => {
    setAnalyticsCode(shortCode);
    setAnalyticsOpen(true);
  };

  return (
    <Layout>
      {/* Hero / Form */}
      <ShortenForm onSuccess={handleShortenSuccess} />

      {/* Result card appears after shortening */}
      {result && (
        <div className="mt-4">
          <ResultCard result={result} />
        </div>
      )}

      {/* Link history table */}
      <div className="mt-8">
        <UrlTable
          urls={urls}
          loading={loading}
          error={error}
          onRefresh={refresh}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onAnalytics={handleAnalytics}
        />
      </div>

      {/* Modals */}
      <EditModal
        url={editTarget}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onUpdated={(updated) => {
          updateUrlInList(updated);
          if (result?.shortCode === updated.shortCode) setResult(updated);
        }}
      />

      <AnalyticsModal
        shortCode={analyticsCode}
        open={analyticsOpen}
        onClose={() => setAnalyticsOpen(false)}
      />
    </Layout>
  );
}
