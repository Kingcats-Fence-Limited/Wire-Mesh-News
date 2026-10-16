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

## 0.3.0 — Account preview, favicon (2026-10-13)
- /account rebuilt as an in-place app: the sidebar switches panels (URL hash follows; back button works), phones get a sticky tab strip
- Full sample data built from site content; every panel is editable and every button acts on browser-local demo state (localStorage, "Reset demo data")
- Panels: Overview, Profile (photo upload), Author profile (live card preview), Account settings (email change with confirmation, password strength, email preferences, devices, data download, delete with typed confirm), Submissions (filters, edit/resubmit, withdraw, delete with undo), Comments, Bookmarks (filter/search/sort), Messages (read, CSV export), Notifications
- My company editor: name and logo, registered address (country → ISO 3166-2 subdivision via /api/vocab/subdivisions/{CC}/), phone calling-code drop-down, product range, product cards with photo picking, company facts, certificates (locked after submission), editor-controlled fields
- Billing: payment methods (card entry is the processor's page), invoice details, invoice view, monthly/annual, cancel and resume
- Section pages: "Most read" only from ranked data
- Favicon set from the logo pack: favicon.ico, icon.svg, apple-icon.png, web manifest 192/512

## 0.4.0 — Phase 2 · accounts and Directus (branch `phase2`, 2026-10-16, not live)
- Passwordless sign-in (Better Auth): Google, Microsoft, 6-digit email code, Google One Tap; accounts linked by verified email; Turnstile on code requests
- Account centre on real data: state from Directus, edits saved by diff to /api/me/sync with server-side rules; uploads (photo, article files, logo, product photos, evidence) re-encoded on the server and private until approved
- Company claim with verified work email; company edits and change requests to the directory editor; claim approval links the company automatically
- Live public features: Save, Follow a standard, article comments, Contact a company, contact / advertising forms, newsletter double opt-in, "My account" in the header — pages stay static
- Directus review hook (notices + emails), daily purge cron, scripts for Directus collections and sign-in tables, docs/PHASE2.md and docs/PHASE2-DIRECTUS.md
- All of it stays off until the environment variables are set; without them the site is the Phase 1 preview

## 0.5.0 — Paid plans and intelligence (branch `phase2`, 2026-10-16, not live)
- Plans: Pro, Team, Company (monthly/yearly, 14-day trial with card) and Directory Sponsor (yearly); /pricing/; Stripe Checkout, customer portal and webhook; billing panel with trial, card, invoices, team seats, reports
- Pro analysis articles: opening on the static page, rest served to entitled readers; 2 free a month for signed-in readers; paywall structured data
- Tenders & project leads, Trade defence tracker, Trade statistics: daily fetchers to editor drafts (TED, World Bank, SAM.gov, Federal Register, RSS, Eurostat, US Census), alerts, Pro detail and CSV
- Templates & tools: welded mesh calculator, specification/checklist library; Reports shop
- Directory: no pinned or separate paid placement; Directory Sponsors keep their place with a ★ SPONSOR mark, highlighted card, website button and labelled rotating sponsor spots; Company plan analytics and profile extras
- Ad-free for paying readers (set before paint)
