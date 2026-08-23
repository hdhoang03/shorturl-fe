// ─── Short URL API Types ─────────────────────────────────────────────────────

export interface ShortenUrlRequest {
  originalUrl: string;
  customAlias?: string;
  expiresInDays?: number; // backend converts to LocalDateTime
}

export interface UpdateUrlRequest {
  originalUrl?: string;    // optional — only update if provided
  expiresInDays?: number;  // optional — extend expiry N days from now
  active?: boolean;
}

export interface ShortUrlResponse {
  id: number;
  shortCode: string;
  originalUrl: string;
  shortUrl: string;
  qrCodeBase64: string | null;
  clickCount: number;     // backend field
  totalClicks: number;    // virtual getter in backend (same value)
  expiresAt: string | null;
  isActive: boolean;
  active: boolean;        // virtual getter in backend (same as isActive)
  createdAt: string;
}

// ─── Analytics Types ──────────────────────────────────────────────────────────
// Backend returns Map<String, Long> for breakdown data

export interface ClickAnalyticsResponse {
  shortCode: string;
  originalUrl: string;
  totalClicks: number;
  uniqueVisitors: number;
  createdAt: string;
  clicksByDevice: Record<string, number>;
  clicksByBrowser: Record<string, number>;
  clicksByOs: Record<string, number>;
  clicksByReferer: Record<string, number>;
  clicksByDate: Record<string, number>;
}

// ─── UI-only helper types ─────────────────────────────────────────────────────
// Normalized bar chart item (computed from Map in the frontend)
export interface BarItem {
  label: string;
  count: number;
  percentage: number;
}

export type ModalType = 'edit' | 'analytics' | null;
