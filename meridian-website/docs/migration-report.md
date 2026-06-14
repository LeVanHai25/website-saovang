# MERIDIAN Website — Migration Report

**Date:** 2026-06-14  
**From:** Static HTML/CSS/JS (company-profile/)  
**To:** Next.js 16 + TypeScript + Tailwind CSS (meridian-website/)

---

## Migration Summary

The existing static site at `d:\Sao Vàng\company-profile\` has been fully materialized into a production-grade Next.js application at `d:\Sao Vàng\meridian-website\`.

---

## What Was Migrated

### Source Files → Target Architecture

| Source File | Size | Migration Output |
|------------|------|-----------------|
| `index.html` (1766 lines) | 134KB | 14 section React components + 1 main page |
| `styles.css` (4353 lines) | 116KB | `src/app/globals.css` (CSS variables preserved verbatim) + `tailwind.config.ts` |
| `script.js` (300 lines) | 12KB | `useKeyboardNavigation.ts` + `KPICard.tsx` + `MetricBar.tsx` + `ScrollReveal.tsx` + `DocumentShell.tsx` |
| `assets/images/` (7 files) | 5.04MB | `public/assets/images/` (bit-for-bit copy) |

### Content Migration

All content extracted from HTML into structured JSON:

| Content Type | Items | File |
|-------------|-------|------|
| Company info | 1 object | company.json |
| KPIs | 4 summary + 4 journey | kpis.json |
| Timeline events | 9 milestones (2009–2026) | timeline.json |
| Vision/Mission/Values | 3 blocks + 5 values | vision.json |
| Executive team | 5 members | team.json |
| Departments | 5 practice areas + 4 model layers | departments.json |
| Core capabilities | 5 (with 5 steps each) | capabilities.json |
| Services | 10 services | services.json |
| Case studies | 4 (with metrics) | case-studies.json |
| Clients | 18 names | clients.json |
| Partners | 6 tech partners | partners.json |
| Certifications | 4 certs + 4 awards | certifications.json |
| Why Choose Us | 6 value propositions | why-us.json |

---

## Architectural Upgrades

| Capability | Before | After |
|-----------|--------|-------|
| Type safety | None (plain JS) | TypeScript strict mode |
| Component isolation | Monolithic HTML | 24 modular React components |
| Content management | Hardcoded HTML | JSON content + adapter pattern |
| Database support | None | Adapter: local/sqlite/supabase |
| Build optimization | None | Next.js Turbopack SSG |
| SEO | Basic meta | Full Next.js Metadata API |
| Print/PDF | window.print() | Enhanced print with animation pre-reveal |
| Deployment | npx serve | Docker · Vercel · GitHub Actions |
| CI/CD | None | GitHub Actions quality gate + auto-deploy |

---

## Preserved Exactly

- ✅ All CSS custom property values (exact hex codes, exact easing functions)
- ✅ All animation timings (200/400/600/900ms durations)
- ✅ All typography (Manrope + Inter, 300–800 weights)
- ✅ All spacing tokens (8px base scale)
- ✅ A4 landscape page system (297×210mm, 120px margin, 12 columns)
- ✅ All 32 pages in exact order and structure
- ✅ All design refinements from last session (split cover, thinned borders, no accent-line)
- ✅ All 7 production images (copied bit-for-bit)
- ✅ KPI counter animation (easeOutCubic, 2s, requestAnimationFrame)
- ✅ Metric bar animation (1.2s, var(--ease-out))
- ✅ Keyboard navigation (Arrow/Page/Home/End keys)
- ✅ PDF export (print-aware — reveals all animations before printing)
- ✅ NavSidebar auto-hide on scroll direction

---

## Known Differences (Non-Material)

| Item | Note |
|------|------|
| Google Fonts loading | Now loaded via CSS @import (same as source) |
| Scroll snap | Present in CSS but not enforced via JS in the Next.js version — relies on native scroll |
| Admin portal | Deferred — controlled by `ENABLE_ADMIN=false` feature flag |

---

## How to Run

```bash
cd "d:\Sao Vàng\meridian-website"

# Development
npm run dev          # → http://localhost:3000

# Validation
npm run lint         # ESLint
npm run type-check   # TypeScript
npm run build        # Production build

# Docker
docker compose up --build

# PDF Export
# Open in browser → Ctrl+P or click print icon in sidebar
```

---

## Next Steps (Optional Enhancements)

1. **Admin Portal** — Set `ENABLE_ADMIN=true`, implement `src/app/admin/` routes
2. **Supabase** — Set `DATA_ADAPTER=supabase` + add credentials to `.env.local`  
3. **Custom Domain** — Update `NEXT_PUBLIC_SITE_URL` + configure DNS
4. **Analytics** — Add Vercel Analytics or Plausible
5. **i18n** — Add Next.js internationalized routing for multi-language support
