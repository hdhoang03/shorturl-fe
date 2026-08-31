# ShortURL

A minimalist URL shortening application built with a React frontend and a Spring Boot backend. The system generates short links using Base62 encoding, caches redirect lookups in Redis, and records per-click analytics (device, OS, browser, referrer).

---

## UI/UX Upgrades (Vercel/Linear Style)

The frontend features a "developer-grade" aesthetic, utilizing design guidelines inspired by **Vercel** and **Linear** while strictly avoiding overly rounded corners, heavy drop shadows, or generic icon sets.

### Key Visual & UX Improvements:
1. **Design System & Typography**:
   - Uses `JetBrains Mono` for tech-centric strings (e.g. short codes, shortened URLs, click counts) for optimal readability.
   - Adopts a strict `4px - 6px` border-radius constraint.
   - Leverages a custom multi-layered shadow token (`shadow-card`) to give pages depth.
2. **Dark Mode Integration**:
   - Class-based theme switcher (`html.dark`) with automatic local storage persistence.
3. **Interactive & Contextual Polish**:
   - **Quick Clipboard Paste**: Interactive clipboard API `Paste` button next to the long URL input.
   - **Copy Button Micro-feedback**: Transitions smoothly on click with a green `"Copied ✓"` confirmation label.
   - **Warning Badges**: Dynamic warning label (amber) highlights links expiring in the next 7 days.
   - **Dynamic Favicons**: Extracts root domains and fetches real-time favicons using the Google S2 API.
4. **Enhanced Navigation & Layout Density**:
   - **Integrated Metrics Dashboard**: Displays inline summary statistics (`Total` / `Active` / `Expired`) dynamically computed on the client.
   - **Client-Side Live Filtering**: Filter tabs (`All`, `Active`, `Expired`) and responsive instant search input powered by the `useUrlFilter` hook.
5. **Mobile-First Responsive Layout**:
   - For screens smaller than `640px` (`sm`), the massive 5-column table collapses automatically into a clean **mobile card list** view.
   - Optimized padding and margins prevent layout density issues on small screens.

---

## Project Structure

This repository is the **frontend** client. The backend lives in a separate repository.

```
shorturl-fe/       React + TypeScript + Tailwind CSS (this repo)
shorturl/          Spring Boot REST API (backend repo)
```

---

## Technology Stack

### Frontend

| Technology | Version | Purpose |
|---|---|---|
| React | 18.3 | UI library & state management |
| TypeScript | 5.4 | Compile-time type safety |
| Vite | 5.3 | Build tool and fast refresh dev server |
| Tailwind CSS | 3.4 | Utility-first responsive styling |
| Axios | 1.7 | REST API client |

### Backend

| Technology | Version | Purpose |
|---|---|---|
| Spring Boot | 4.1 | Application framework |
| Spring Security | - | CORS policies & endpoint whitelisting |
| Spring Data JPA | - | Object-relational mapping (MySQL) |
| Spring Data Redis | - | Caching layer integrations |
| MySQL | 8.0 | Persistent database |
| Redis | 7 | Caching short code redirects |
| ZXing | 3.5.3 | QR code encoding |
| MapStruct | 1.5.5 | Controller to Entity mapper |
| Springdoc OpenAPI | 2.5.0 | Interactive API specification (Swagger UI) |
| Lombok | - | Boilerplate reductions |
| Java | 21 | Development platform |

---

## Features

- **Base62 URL Shortener**: Instantly shorten URLs into highly compressed slugs.
- **Custom Expiry Limits**: Choose custom lifespan parameters (1, 7, 30, 90 days, or no expiry).
- **Responsive QR Codes**: Display QR codes dynamically with clean, toggleable slide animation.
- **Low-Latency Redirection**: Redis cache warmups handle immediate traffic with minimal database overhead.
- **Deep Analytics Integration**: Tracks visitor click timelines, referrer sources, device classes, operating systems, and browsers.
- **Local Storage Batch Fetching**: Retains a secure history cache client-side to retrieve user links across sessions.
- **Inline Editing & Control**: Modify redirect targets, adjust validation statuses, or delete links instantly.

---

## Prerequisites

Before running the project locally, ensure the following are installed:

- Node.js 20 or later
- Java 21
- Maven 3.9 or later
- Docker & Docker Compose (for database/cache virtualization)

---

## Getting Started

### 1. Start Infrastructure (MySQL and Redis)

From the backend project root:

```bash
docker compose up -d
```

This starts:
- MySQL 8.0 on port `3306` with database `shorturl_db`
- Redis 7 on port `6379`

### 2. Run the Backend

```bash
cd shorturl
./mvnw spring-boot:run
```

The API server starts on `http://localhost:8080`.
Swagger UI is available at: `http://localhost:8080/swagger-ui.html`

### 3. Run the Frontend

```bash
cd shorturl-fe
npm install
npm run dev
```

The frontend starts on `http://localhost:3000` (or configured fallback port).

---

## Backend Configuration

The main configuration file is located at `src/main/resources/application.yaml`.

```yaml
server:
  port: 8080

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/shorturl_db
    username: root
    password: root

  data:
    redis:
      host: localhost
      port: 6379

app:
  base-url: http://localhost:8080/
```

Modify `app.base-url` to match your deployment domain when running in production.

---

## API Reference

Base path: `/api/v1/urls`

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/urls/shorten` | Create a new short URL |
| GET | `/api/v1/urls/{shortCode}` | Get metadata for a short link |
| POST | `/api/v1/urls/batch` | Get metadata for multiple short codes |
| PUT | `/api/v1/urls/{shortCode}` | Update a short link |
| DELETE | `/api/v1/urls/{shortCode}` | Delete a short link |
| GET | `/api/v1/urls/{shortCode}/analytics` | Get click analytics |
| GET | `/{shortCode}` | Redirect to the original URL |

All responses follow a consistent `ApiResponse<T>` envelope:

```json
{
  "status": 200,
  "message": "Success",
  "data": { }
}
```

---

## Frontend Structure

```
src/
  api/           Axios client and API service wrappers
  components/
    analytics/   Click analytics charts, graphs, and statistic grids
    common/      Reusable UI atoms (Button, Input, Badge, CopyButton, Modal)
    layout/      Header, footer, and shell elements (Layout, Dark Mode hook)
    url/         Result display cards, URL lists, row items, and metrics
  hooks/         Custom React state helpers (useUrls, useUrlFilter, useAnalytics)
  pages/         Application route containers (HomePage)
  types/         TypeScript domain models and responses
  utils/         Date validators, domain extractors, and formatting helpers
```

---

## CORS Whitelist

The backend allows requests from the following origins by default:
- `http://localhost:3000`
- `http://localhost:3001`
- `http://localhost:5173`

To add additional origins, update `SecurityConfig.java`.

---

## Build for Production

### Frontend

```bash
npm run build
```

Output is written to the `dist/` directory.

### Backend

```bash
./mvnw clean package -DskipTests
java -jar target/shorturl-0.0.1-SNAPSHOT.jar
```

---

## License

This project is for personal and educational use.
