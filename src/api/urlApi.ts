import axios from 'axios';
import type {
  ShortenUrlRequest,
  UpdateUrlRequest,
  ShortUrlResponse,
  ClickAnalyticsResponse,
} from '../types';

// ─── Axios Instance ───────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10_000,
});

// ─── Response Wrapper ─────────────────────────────────────────────────────────
// All backend responses are wrapped: { status, message, data, timestamp }
// We unwrap .data.data to get the actual payload.

interface ApiWrapper<T> {
  status: number;
  message: string;
  data: T;
  timestamp: string;
}

function unwrap<T>(res: { data: ApiWrapper<T> }): T {
  return res.data.data;
}

// ─── URL Endpoints ────────────────────────────────────────────────────────────

/**
 * POST /api/v1/urls/shorten
 */
export async function shortenUrl(body: ShortenUrlRequest): Promise<ShortUrlResponse> {
  const res = await api.post<ApiWrapper<ShortUrlResponse>>('/urls/shorten', body);
  return unwrap(res);
}

/**
 * GET /api/v1/urls/{shortCode}
 */
export async function getUrlDetails(shortCode: string): Promise<ShortUrlResponse> {
  const res = await api.get<ApiWrapper<ShortUrlResponse>>(`/urls/${shortCode}`);
  return unwrap(res);
}

/**
 * POST /api/v1/urls/batch
 */
export async function getBatchUrls(shortCodes: string[]): Promise<ShortUrlResponse[]> {
  const res = await api.post<ApiWrapper<ShortUrlResponse[]>>('/urls/batch', shortCodes);
  return unwrap(res);
}

/**
 * PUT /api/v1/urls/{shortCode}
 */
export async function updateUrl(
  shortCode: string,
  body: UpdateUrlRequest
): Promise<ShortUrlResponse> {
  const res = await api.put<ApiWrapper<ShortUrlResponse>>(`/urls/${shortCode}`, body);
  return unwrap(res);
}

/**
 * DELETE /api/v1/urls/{shortCode}
 */
export async function deleteUrl(shortCode: string): Promise<void> {
  await api.delete(`/urls/${shortCode}`);
}

/**
 * GET /api/v1/urls/{shortCode}/analytics
 */
export async function getAnalytics(shortCode: string): Promise<ClickAnalyticsResponse> {
  const res = await api.get<ApiWrapper<ClickAnalyticsResponse>>(`/urls/${shortCode}/analytics`);
  return unwrap(res);
}
