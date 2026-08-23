# shorturl-fe

Frontend for a URL shortening service, built with React, TypeScript, and Tailwind CSS.

---

## Tech Stack

- **React 18** — UI library
- **TypeScript** — Static typing
- **Vite 5** — Build tool and dev server
- **Tailwind CSS 3** — Utility-first styling
- **Axios** — HTTP client

---

## Requirements

- Node.js >= 18
- Spring Boot backend running at `http://localhost:8080`

---

## Setup

```bash
# Install dependencies
npm install

# Start dev server (port 3000)
npm run dev

# Build for production
npm run build
```

---

## Project Structure

```
src/
├── api/
│   └── urlApi.ts              # Axios instance and all API calls
├── components/
│   ├── analytics/
│   │   ├── AnalyticsModal.tsx # Modal for detailed click analytics
│   │   ├── BarChart.tsx       # Horizontal bar chart (pure CSS)
│   │   └── StatCard.tsx       # Single metric display card
│   ├── common/
│   │   ├── Badge.tsx          # Status badge (Active / Expired / Inactive)
│   │   ├── Button.tsx         # Button with four variants
│   │   ├── CopyButton.tsx     # Copy to clipboard with feedback state
│   │   ├── Input.tsx          # Input with label, hint, and error support
│   │   └── Modal.tsx          # Base modal (ESC to close, scroll lock)
│   ├── layout/
│   │   ├── Header.tsx         # Sticky top navigation header
│   │   └── Layout.tsx         # Page wrapper with header and footer
│   └── url/
│       ├── EditModal.tsx      # Modal for updating a short URL
│       ├── ResultCard.tsx     # Displays newly created link with QR code
│       ├── ShortenForm.tsx    # URL input form with alias and expiry options
│       ├── UrlRow.tsx         # Table row with inline QR code toggle
│       └── UrlTable.tsx       # Link history table with loading skeleton
├── hooks/
│   ├── useAnalytics.ts        # On-demand analytics fetch by short code
│   └── useUrls.ts             # URL list state (localStorage + batch API)
├── pages/
│   └── HomePage.tsx           # Main page composing all components
├── types/
│   └── index.ts               # TypeScript interfaces for API and UI
└── utils/
    └── format.ts              # Helpers for date, URL truncation, number formatting
```

---

## Features

| Feature | Description |
|---------|-------------|
| URL shortening | Submit a long URL with an optional custom alias and expiry |
| Copy link | One-click copy of the short URL to clipboard |
| QR code | View and download a QR code PNG for any link |
| Link history | Table of created links persisted in localStorage |
| Analytics | Click breakdown by device, browser, OS, and referrer |
| Edit link | Update target URL, extend expiry, or toggle active state |
| Delete link | Two-step confirmation before deletion |
| Rate limiting | Backend enforces a limit of 10 links per minute per IP via Redis |

---

## Backend Connection

Vite proxies all `/api` requests to `http://localhost:8080` in development. No CORS configuration or base URL is needed on the frontend.

```ts
// vite.config.ts
server: {
  proxy: {
    '/api': { target: 'http://localhost:8080', changeOrigin: true }
  }
}
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/urls/shorten` | Create a new short URL |
| POST | `/api/v1/urls/batch` | Fetch multiple URLs by short code list |
| GET | `/api/v1/urls/{code}` | Get details of a single URL |
| PUT | `/api/v1/urls/{code}` | Update a URL |
| DELETE | `/api/v1/urls/{code}` | Delete a URL |
| GET | `/api/v1/urls/{code}/analytics` | Get click analytics |

All responses are wrapped by the backend in an `ApiResponse<T>` envelope. The frontend unwraps `response.data.data` to access the actual payload.
