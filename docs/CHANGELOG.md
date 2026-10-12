# Changelog

## 0.1.0 — Phase 1 · step 1 (2026-10-12)
- Next.js 15 App Router + TypeScript + Tailwind v4 scaffold (pnpm)
- Design tokens in `src/app/globals.css` (`@theme`), dark mode via `data-theme`
- Fonts self-hosted: Bricolage Grotesque Variable (opsz) + Manrope Variable; no monospace anywhere, numerals use `.num`
- `src/components/ui`: Wordmark/BrandIcon, MeshBg (7 patterns + gauge ramp), SocialButton (5 channels, official glyphs), Button/ButtonLink/MoreLink, Kicker, SectionHead, Chip, Badge (status + 7 content types), Card, Thumb, AdSlot/AdBand
- `src/components/theme`: ThemeScript (no-flash) + ThemeToggle
- `src/data/vocab`: 31 controlled vocabularies generated from the xlsx (`scripts/build-vocab.mjs`)
- `/design` showcase page (noindex) for review

## 0.2.0 — Phase 1 · static browsable build (2026-10-12)
- Content layer (`src/lib/content`): 44 articles, 8 letters, 3 columns, 12 companies, 8 events, 14 standards, 6 market series, 5 topics, 4 authors, 10 policies (local mock data)
- Global shell: utility bar, masthead (date + three clocks), primary nav with mega menu, search overlay ("/" shortcut), full footer, cookie consent, back-to-top, dark mode
- Pages: home, section + subsection, article, letters (list / letter / column), directory (filters) + company + contact form, events, standards index + detail (follow + change log), market data + methodology, topics, authors, search, about, contact, advertise, submit, sign-in / register / subscribe, 404, RSS
- One search index and one result renderer shared by the overlay and the results page
- Responsive at 390 / 900 / 1340 with no horizontal overflow
