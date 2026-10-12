# Changelog

## 0.1.0 — Phase 1 · step 1 (2026-10-12)
- Next.js 15 App Router + TypeScript + Tailwind v4 scaffold (pnpm)
- Design tokens in `src/app/globals.css` (`@theme`), dark mode via `data-theme`
- Fonts self-hosted: Bricolage Grotesque Variable (opsz) + Manrope Variable; no monospace anywhere, numerals use `.num`
- `src/components/ui`: Wordmark/BrandIcon, MeshBg (7 patterns + gauge ramp), SocialButton (5 channels, official glyphs), Button/ButtonLink/MoreLink, Kicker, SectionHead, Chip, Badge (status + 7 content types), Card, Thumb, AdSlot/AdBand
- `src/components/theme`: ThemeScript (no-flash) + ThemeToggle
- `src/data/vocab`: 31 controlled vocabularies generated from the xlsx (`scripts/build-vocab.mjs`)
- `/design` showcase page (noindex) for review
