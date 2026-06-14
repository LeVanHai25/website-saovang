# MERIDIAN Website — Architecture Report

**Date:** 2026-06-14  
**Stack:** Next.js 16 · TypeScript 5 · Tailwind CSS 4 · React 19

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Print Client                     │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTP / Print
┌───────────────────────────▼─────────────────────────────────┐
│                   Next.js App Router (SSG)                    │
│                                                               │
│  src/app/page.tsx (Server Component)                          │
│    ├── fetches via db.get*() → ContentRepository              │
│    └── renders DocumentShell + all 32 section components      │
│                                                               │
│  src/components/layout/                                        │
│    ├── DocumentShell ('use client') — page tracker + print    │
│    ├── NavSidebar    ('use client') — fixed sidebar nav        │
│    └── PageIndicator ('use client') — current/total counter   │
│                                                               │
│  src/components/sections/ (14 Server Components)              │
│    01 CoverPage · 02 ExecutiveSummary · 03 WhoWeAre           │
│    04–05 TimelineSection · 06 VMVSection                      │
│    07–08 Organization · 09–13 CapabilitiesSection             │
│    14–18 ServicesSection · 19–26 CaseStudiesSection           │
│    27–28 ClientsPartners · 29 CertificationsSection           │
│    30 WhyUsSection · 31 ContactSection · 32 BackCover         │
│                                                               │
│  src/components/ui/ (4 Client Components)                     │
│    KPICard · MetricBar · ScrollReveal · LogoMark              │
└───────────────────────────┬─────────────────────────────────┘
                            │ import
┌───────────────────────────▼─────────────────────────────────┐
│                     Data Layer                                │
│                                                               │
│  src/data/index.ts                                            │
│    └── createRepository() ←── DATA_ADAPTER env var            │
│          ├── 'local'    → localAdapter (default)              │
│          ├── 'sqlite'   → sqliteAdapter (stub)                │
│          └── 'supabase' → supabaseAdapter (stub)              │
│                                                               │
│  src/data/repository.ts — ContentRepository interface         │
│  src/data/adapters/local/index.ts — reads src/content/*.json │
│  src/data/adapters/sqlite/index.ts — stub, ready to impl      │
│  src/data/adapters/supabase/index.ts — stub, ready to impl    │
└───────────────────────────┬─────────────────────────────────┘
                            │ import
┌───────────────────────────▼─────────────────────────────────┐
│                   Content Layer                               │
│                                                               │
│  src/content/*.json (13 files) + index.ts barrel              │
│    company · kpis · timeline · vision · team                  │
│    departments · capabilities · services · case-studies        │
│    clients · partners · certifications · why-us               │
│                                                               │
│  src/types/content.ts — 22 TypeScript interfaces              │
└─────────────────────────────────────────────────────────────┘
```

---

## Key Design Decisions

### 1. Static Site Generation (SSG)
All pages are prerendered at build time. The content is read from JSON files, no runtime server needed. Deploy anywhere: Vercel, Nginx, S3+CloudFront.

### 2. Adapter Pattern
Data access is abstracted behind the `ContentRepository` interface. Switching databases requires only changing `DATA_ADAPTER` env var — zero code changes.

### 3. CSS-First Design System
The original `styles.css` CSS custom properties are preserved verbatim in `globals.css`. Tailwind is used for utility classes but the design system lives in CSS variables — ensuring exact visual parity with the source.

### 4. Server + Client Component Split
- Section components are **Server Components** (no `'use client'`) — fast, no hydration overhead
- Interactive UI (KPICard counter, MetricBar, ScrollReveal, NavSidebar) are **Client Components** — minimal, targeted hydration

### 5. Animation Architecture
Animations use native `IntersectionObserver` (not framer-motion) — matching the original `script.js` behavior exactly:
- `ScrollReveal` — fade-in + slide-up with `is-visible` class toggle
- `KPICard` — requestAnimationFrame counter with easeOutCubic
- `MetricBar` — CSS transition triggered by width change

---

## Scalability Path

| Feature | Current | Migration Path |
|---------|---------|----------------|
| Content | JSON files | Set `DATA_ADAPTER=supabase` |
| Database | None | Set `DATA_ADAPTER=sqlite` + install better-sqlite3 |
| Admin | Disabled | Set `ENABLE_ADMIN=true` + implement admin routes |
| Auth | None | Add NextAuth.js to admin routes |
| i18n | Single locale | Add Next.js i18n routing |
| Analytics | None | Add Vercel Analytics or Plausible |
