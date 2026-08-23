# Short URL Frontend — React + TailwindCSS

## Mô tả

Xây dựng giao diện frontend cho hệ thống rút gọn URL (ShortURL) dựa trên backend Java Spring Boot đã có.
Phong cách thiết kế: **Clean, editorial, tối giản** — không icon trang trí, không bo góc quá nhiều, ưu tiên typography và layout rõ ràng, tone màu trung tính (trắng/đen/xám) với 1 màu accent.

---

## API Backend (đã phân tích)

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `POST` | `/api/v1/urls/shorten` | Tạo short URL mới |
| `GET` | `/api/v1/urls/{shortCode}` | Lấy chi tiết một short URL |
| `POST` | `/api/v1/urls/batch` | Lấy nhiều short URL theo danh sách shortCode |
| `PUT` | `/api/v1/urls/{shortCode}` | Cập nhật URL (target, expiry, active status) |
| `DELETE` | `/api/v1/urls/{shortCode}` | Xóa short URL |
| `GET` | `/api/v1/urls/{shortCode}/analytics` | Xem analytics: clicks, device, OS, browser, referrer |
| `GET` | `/{shortCode}` | Redirect về URL gốc (HTTP 302) |

---

## Cấu trúc thư mục đề xuất

```
shorturl-fe/
├── public/
├── src/
│   ├── api/
│   │   └── urlApi.ts             # Axios instances + tất cả API calls
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx        # Logo + nav
│   │   │   └── Layout.tsx        # Wrapper chính
│   │   ├── url/
│   │   │   ├── ShortenForm.tsx   # Form nhập URL dài + tùy chọn
│   │   │   ├── ResultCard.tsx    # Hiển thị short URL vừa tạo + nút copy
│   │   │   ├── UrlTable.tsx      # Bảng danh sách các URL đã tạo
│   │   │   ├── UrlRow.tsx        # Hàng trong bảng (edit / delete / analytics)
│   │   │   └── EditModal.tsx     # Modal cập nhật URL
│   │   ├── analytics/
│   │   │   ├── AnalyticsModal.tsx  # Modal xem analytics tổng quan
│   │   │   ├── StatCard.tsx        # Card số liệu (total clicks, unique...)
│   │   │   └── BarChart.tsx        # Biểu đồ thanh (device, browser, OS)
│   │   └── common/
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Modal.tsx
│   │       ├── Badge.tsx         # Active / Expired badge
│   │       └── CopyButton.tsx
│   ├── hooks/
│   │   ├── useUrls.ts            # Quản lý danh sách URL từ localStorage
│   │   └── useAnalytics.ts      # Fetch analytics data
│   ├── pages/
│   │   ├── HomePage.tsx          # Trang chính: form + bảng history
│   │   └── AnalyticsPage.tsx     # Trang analytics chi tiết (optional)
│   ├── types/
│   │   └── index.ts              # TypeScript interfaces
│   ├── utils/
│   │   └── format.ts             # Format date, truncate URL...
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Thiết kế UI

### Trang chính (HomePage)

```
┌────────────────────────────────────────────────────────────┐
│  SHORTURL                                    History  Docs  │  ← Header (border-bottom)
├────────────────────────────────────────────────────────────┤
│                                                            │
│  Shorten your URL                                          │  ← Hero section
│  ──────────────────────────────────────────────────────   │
│  [ https://very-long-url.com/path?query=...         ]      │  ← Input
│  [ Custom alias (optional) ]  [ Expires in: 7 days ]       │
│                                        [ Shorten ]         │
│                                                            │
│  ── Result ─────────────────────────────────────────────   │
│  short.ly/abc123       [Copy]  [Open]                      │  ← ResultCard
│                                                            │
├────────────────────────────────────────────────────────────┤
│  Your links                                 [Refresh]      │  ← Table section
│  ─────────────────────────────────────────────────────     │
│  Original URL          Short code   Clicks  Status  Action │
│  ─────────────────────────────────────────────────────     │
│  https://example...    abc123       42      Active   ...    │
│  https://google...     xyz789       8       Expired  ...    │
└────────────────────────────────────────────────────────────┘
```

### Analytics Modal

```
┌──────────────────────────────────────────────────────┐
│  Analytics — abc123                            [✕]   │
│  ────────────────────────────────────────────────    │
│  Total Clicks: 42    Unique: 31    Last Click: ...   │
│  ────────────────────────────────────────────────    │
│  Device          Browser        OS                   │
│  ██ Mobile 60%   ██ Chrome 70%  ██ Android 55%       │
│  ██ Desktop 40%  ██ Safari 30%  ██ Windows 45%       │
│  ────────────────────────────────────────────────    │
│  Top Referrers                                       │
│  google.com   15   facebook.com  8   direct  19     │
└──────────────────────────────────────────────────────┘
```

---

## Design Tokens

| Token | Value | Ghi chú |
|-------|-------|---------|
| `--color-accent` | `#1a1a1a` | Màu chính (đen editorial) |
| `--color-accent-blue` | `#2563eb` | Màu CTA button |
| `--color-surface` | `#ffffff` | Background |
| `--color-border` | `#e5e7eb` | Đường kẻ nhạt |
| `--color-muted` | `#6b7280` | Text phụ |
| `border-radius` | `4px` | Tối thiểu, không bo tròn nhiều |
| `font-family` | `Inter` | Google Fonts |

---

## Proposed Changes

### [NEW] Project scaffold với Vite + React + TailwindCSS
- Khởi tạo bằng `npx create-vite@latest shorturl-fe -- --template react-ts`
- Cài TailwindCSS v3
- Cấu hình `tailwind.config.js` với color tokens

### [NEW] `src/types/index.ts`
- Interface `ShortUrlResponse`, `ClickAnalyticsResponse`, `ShortenUrlRequest`, `UpdateUrlRequest`

### [NEW] `src/api/urlApi.ts`
- Axios base instance pointing tới `http://localhost:8080`
- Các hàm: `shortenUrl`, `getUrlDetails`, `getBatchUrls`, `updateUrl`, `deleteUrl`, `getAnalytics`

### [NEW] `src/hooks/useUrls.ts`
- Lưu danh sách `shortCodes` vào `localStorage`
- Gọi batch API để fetch thông tin khi load

### [NEW] Components (theo cấu trúc trên)

---

## Open Questions

> [!IMPORTANT]
> **Base URL API**: Backend chạy ở `http://localhost:8080` — có cần thay đổi không?

> [!IMPORTANT]
> **Routing**: Có cần nhiều page riêng (React Router) hay chỉ cần 1 trang duy nhất (single page) với modal?

> [!NOTE]
> **Tên miền rút gọn**: Phần ResultCard hiển thị URL dạng `localhost:8080/{shortCode}` — có domain thật không?

---

## Verification Plan

- Chạy `npm run dev`, mở browser kiểm tra giao diện
- Test form shorten → copy link
- Test bảng history load từ localStorage
- Test analytics modal
