# UI Enhancement — Gói 3 Toàn Bộ

Nâng cấp toàn diện giao diện ShortURL theo phong cách **Developer-grade craft UI** (Vercel/Linear/Stripe), không AI-slop, duy trì clean code và cấu trúc component tách biệt.

## Tóm tắt thay đổi

| Khu vực | Thay đổi chính |
|---|---|
| Design System | Màu sắc mới, font Monospace `JetBrains Mono`, shadow đa tầng |
| Header | Thêm dark mode toggle, logo tinh tế hơn |
| ShortenForm | Nút Ctrl+V paste nhanh, Enter↵ badge trên Submit |
| CopyButton | Micro-spring animation, ripple effect khi copy |
| Badge | Pastel pill mới với chấm nhấp nháy (Active), Expiring Soon |
| UrlRow | Favicon tự fetch theo domain, QR Popover tinh gọn hơn |
| UrlTable | Live search + Filter tabs (All/Active/Expired) + 3 metric cards |
| ResultCard | QR panel nâng cấp, Monospace link style |
| DashboardMetrics | Component mới — 3 thẻ thống kê tổng quan |
| QrPopover | Component mới — popover QR code hover/click trong UrlRow |
| FaviconImg | Component mới — tự fetch favicon domain |

## Open Questions

> [!IMPORTANT]
> Favicon API: Sẽ dùng `https://www.google.com/s2/favicons?domain={domain}&sz=32` (free, không cần auth, hoạt động tốt cho developer tool). Bạn có muốn dùng nguồn khác không?

> [!NOTE]
> Dark Mode: Đề xuất chỉ thêm class-based dark mode (thêm class `dark` vào `<html>`) để giữ giao diện clean, không bị over-engineered. Toggle sẽ lưu vào `localStorage`.

## Proposed Changes

---

### Design System

#### [MODIFY] [tailwind.config.js](file:///c:/Users/HP/Desktop/shorturl-fe/tailwind.config.js)
- Thêm font `JetBrains Mono` vào `fontFamily.mono`
- Thêm màu `warning` (amber) cho badge "Expiring Soon"
- Nâng `borderRadius` mặc định lên `6px` để card mềm mại hơn
- Thêm `boxShadow` custom `card` với shadow đa tầng tinh tế

#### [MODIFY] [index.css](file:///c:/Users/HP/Desktop/shorturl-fe/src/index.css)
- Import `JetBrains Mono` từ Google Fonts
- Thêm CSS animation `@keyframes ripple`, `@keyframes pulse-dot`
- Custom scrollbar tinh tế hơn
- Dark mode base styles

---

### Common Components

#### [MODIFY] [CopyButton.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/common/CopyButton.tsx)
- Thêm icon SVG thay cho text thuần
- Hiệu ứng checkmark nảy khi copied (CSS animation)
- Ripple effect lan tỏa khi click

#### [MODIFY] [Badge.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/common/Badge.tsx)
- Thêm variant `warning` (Expiring Soon — amber)
- Active badge có chấm xanh nhấp nháy `animate-pulse`
- Pill shape thay vì rectangle

#### [MODIFY] [Button.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/common/Button.tsx)
- Nâng cấp `primary` variant với shadow nhẹ + hover lift effect
- Thêm `icon` slot prop

---

### New Common Components

#### [NEW] `src/components/common/FaviconImg.tsx`
- Render favicon của domain dựa trên URL
- Fallback sang icon "link" SVG nếu không tải được favicon
- Chỉ render `<img>` — không logic phức tạp

---

### Layout

#### [MODIFY] [Header.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/layout/Header.tsx)
- Thêm nút toggle Dark Mode (icon sun/moon)
- Logo wordmark đẹp hơn với dấu `/` màu accent

#### [MODIFY] [Layout.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/layout/Layout.tsx)
- Footer thêm thông tin build + version
- Áp dụng dark mode class

---

### URL Components

#### [MODIFY] [ShortenForm.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/url/ShortenForm.tsx)
- Nút `Ctrl+V` nhỏ bên phải input URL — click tự paste clipboard
- Submit button hiển thị badge `⏎` khi đang nhập
- Error message animation slide-in

#### [MODIFY] [UrlRow.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/url/UrlRow.tsx)
- Thêm `FaviconImg` cạnh Original URL
- QR button dùng SVG icon thay text "QR"
- Badge cập nhật logic `warning` (sắp hết hạn trong 7 ngày)

#### [MODIFY] [UrlTable.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/url/UrlTable.tsx)
- Thêm `DashboardMetrics` ở trên header bảng
- Thêm thanh tìm kiếm live filter (theo URL / short code)
- Thêm Filter Tabs: `All` | `Active` | `Expired`
- Tách logic filter ra hook riêng `useUrlFilter.ts`

#### [MODIFY] [ResultCard.tsx](file:///c:/Users/HP/Desktop/shorturl-fe/src/components/url/ResultCard.tsx)
- Short URL dùng font `font-mono` đẹp hơn
- QR panel có animation expand mượt
- Badge "Just created" xanh lá nhỏ

---

### New Feature Components

#### [NEW] `src/components/url/DashboardMetrics.tsx`
- 3 thẻ thống kê: **Total Links** | **Total Clicks** | **Active / Expired**
- Compact card với icon SVG + số liệu
- Tính toán từ `urls[]` array truyền vào (không cần API mới)

#### [NEW] `src/hooks/useUrlFilter.ts`
- Custom hook quản lý state `search` + `filter` (all/active/expired)
- Export `filteredUrls`, `search`, `setSearch`, `filter`, `setFilter`
- Pure logic — không liên quan UI

---

### Utils

#### [MODIFY] [format.ts](file:///c:/Users/HP/Desktop/shorturl-fe/src/utils/format.ts)
- Thêm hàm `getDomain(url)` — trích xuất hostname để fetch favicon
- Thêm hàm `isExpiringSoon(expiresAt, days = 7)` — badge warning

---

## Verification Plan

### Automated Build Check
```bash
npm run build
```

### Browser Preview
- Dùng browser subagent chụp screenshot giao diện sau khi hoàn thành
- Kiểm tra: Copy button animation, Live search, Dark mode, Favicon icons

### Manual Checklist
- [ ] Không có lỗi TypeScript
- [ ] Live filter hoạt động đúng
- [ ] Badge "Expiring Soon" xuất hiện đúng
- [ ] Favicon load đúng / fallback graceful
- [ ] Dark mode toggle save localStorage
- [ ] QR popover mở/đóng mượt
