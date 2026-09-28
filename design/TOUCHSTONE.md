# Touchstone — the Bestone design system

> **Touchstone**: the dark stone goldsmiths rubbed gold on to read its purity.
> In everyday English, the standard everything else is judged by.
> Bestone → be·**stone**.

This file is the source of truth for decisions. The labs are in `design/lab/`
(`01-name.html` to `03-library.html`, with the latest lab at `index.html`).
In the app, tokens live at the top of `apps/web/src/app/globals.css` and the
components in `apps/web/src/components/touchstone/`.
When the system is settled, the components move into the app and are shown on a
live `/touchstone` route, in the same way as Itqan's `/itqan`.

## Philosophy

**Say it plainly. Prove it on the page.**

1. Every claim carries its proof: a figure, a registration number or a report.
2. The price appears before anyone has to ask for it.
3. Every job leaves a record of who, what, where and when.

Personality: Mr Reliable. The voice of a practical local foreman, the paperwork of
a professional firm, the speed of a responder, the manners of a good neighbour.

## House rules

- No shadows.
- Space and surface separate blocks, not lines. A line appears only where an input needs an edge.
- No dark sections. Charcoal is for text and small elements only.
- Lime `#B7F56A` is never text; text on lime is ink.
- Beside copy, a photo is as tall as the copy.
- No empty grid cells at any width.
- Card, step and point titles are two or three words; bodies are one sentence.
- Nothing looks browser-drawn (selects, date pickers, scrollbars, tooltips).
- Calm motion: transform and opacity only, reduced-motion respected.
- Proof points are facts the business stands behind, never ratings, urgency or superlatives.
- Pests are never pictured. Show the fix: inspection, proofing, a protected home.

## Decisions

| Date | Decision | Source |
|---|---|---|
| 2026-09-28 | System name: Touchstone | Lab 01 |
| 2026-09-28 | Headings: tall, condensed grotesk; final family chosen in Lab 02 | Lab 01, Touchstone specimen |
| 2026-09-28 | Steps and sequences use numbered plaques (door-number shape) | Lab 01, from Threshold |
| 2026-09-28 | Job status ticket: booked, on the way, done, report sent | Lab 01, from Sorted |
| 2026-09-28 | "Leave it with us" is the voice line for urgent pages | Lab 01, from Sorted |
| 2026-09-28 | Confirmations carry a "who's coming" card (name, photo ID) | Lab 01, from Threshold |
| 2026-09-28 | Victorian tile pattern dropped (too close to Itqan's khatam) | Lab 01 |
| 2026-09-28 | Lime `#B7F56A` is final | Client |
| 2026-09-28 | Brand name in copy is "Bestone" (one word); legal name "Bestone Services Ltd" | Client |
| 2026-09-28 | Website is English only, London-wide professional | Client |
| 2026-09-28 | Photos: only approved site photos; illustrations are drawn, photos are never edited or generated | Client |
| 2026-09-28 | Type: Portland — Archivo condensed (82%) headings and figures, Albert Sans text | Lab 02 |
| 2026-09-28 | Colour: Record — paper #F6F5F1, white surfaces, stone #ECEAE3, charcoal #1D201E, lime #B7F56A | Lab 02 |
| 2026-09-28 | Mobile booking follows Portland, with more modern variants explored in Lab 03 | Lab 02 |
| 2026-09-28 | Secondary buttons are white on the paper page (stone only on white surfaces) | Lab 02 feedback |
| 2026-09-28 | Markers are lime tiles with an ink tick; a bare lime dot on paper is never used | Lab 02 feedback |
| 2026-09-28 | Gradients allowed in moderation: lime gradient for main actions and progress, lime wash behind heroes and booking | Lab 02 feedback |
| 2026-09-28 | Tables use record rows: alternating tone, tabular figures, no rules | Lab 02 feedback |
| 2026-09-28 | Review is done in one pass: the whole library on one page with a pick list | Lab 02 feedback |
| 2026-09-28 | Ornaments kept: hallmarks (S01), rooms-done floor plan (S02 B), uniform piping (S03), four petals as corner mark and bullets (S04 A+B), report stamp (S06 A). Streak (S05) not picked | Lab 03 |
| 2026-09-28 | Headings use two weights (S07 C) | Lab 03 |
| 2026-09-28 | Contact tiles (S11 B), sticky bar with price (S12 B), header with info row (S13 B), services menu (S14), grouped phone menu (S15 B), breadcrumbs and tabs (S16) | Lab 03 |
| 2026-09-28 | Heroes: S17 homepage, S18 service hubs, S19 service, S20 urgent, S21 landlords, S22 areas | Lab 03 |
| 2026-09-28 | Service card with photo on top (S23 A); price list as record rows (S24 A); S25–S34 kept | Lab 03 |
| 2026-09-28 | Proof: big-figure facts (S35 B), credentials, guarantees, rating, quote review card (S39 A), own team, who's coming | Lab 03 |
| 2026-09-28 | Job status as a progress line (S44 B); forms S45–S49 kept | Lab 03 |
| 2026-09-28 | Booking combines lime wash (S50 B) with one question per screen (S50 C); S51–S54 kept | Lab 03 |
| 2026-09-28 | FAQ as split with help (S55 B); page endings use the slim band (S58 A); footer, states S60–S61 and documents S62–S64 kept | Lab 03 |
| 2026-09-28 | Data marks (meters, bars, counts) are charcoal; lime is only for selection and actions | Lab 04 |
| 2026-09-28 | Date and time: the sundial — the day dial (R1 D) carrying the sun's position from the time-of-day cards (R1 C), with the morning/afternoon list as its accessible view | Lab 04 |
| 2026-09-28 | Main button is solid lime (R2 A); selected states are solid lime too. Gradients stay for progress bars and background washes only | Lab 04 |
| 2026-09-28 | Homepage headline uses two weights, no streak (R3 B) | Lab 04 |
| 2026-09-28 | Prices on cards sit in the soft lime price tile (R4 C) | Lab 04 |
| 2026-09-28 | Secondary buttons, text links and sizes kept as shown (R5) | Lab 04 |
| 2026-09-28 | One icon set: Lucide, 1.75 stroke (Hugeicons to be phased out) | Build |

## Open

- A transparent logo file (SVG or PNG) for the header; until then the header shows the Bestone wordmark in type.
- Footer trust badges ("100% Verified", "Licensed Professional Service") and FAQ claims ("2-hour dispatch", "32 boroughs") need the client's proof or removal.
- Proofs from the client: CRRU-approved rodenticide certificate, waste carrier registration number, insurance (public liability, employer's liability, goods in transit), DBS checks.
- Which phone number is official (020 8079 7336 on the site, 07729 861195 in directories).
- Re-clean guarantee length: 48 hours today; competitors offer 72 hours or 7 days.
- Before launch: redirect map for live URLs missing from the new build (carpet beetles, silverfish, moth, spider and others), and one host (www or bare) with the other redirected.

## Working method

- Labs are static pages in `design/lab/`, viewed through raw.githack from the `claude/sharp-hawking-iytf87` branch.
- `vercel.json` and `apps/web/vercel.json` skip deployments for `claude/**` branches, so lab pushes cost no Vercel builds.

## Build progress

| Step | State |
|---|---|
| Tokens, fonts (Archivo + Albert Sans), shadows off, 12px controls | Done |
| Site-wide colour migration: olive text → charcoal, dark fills → lime, mint lines → stone, lime text → charcoal (`design/touchstone-codemod.py`) | Done |
| Brand name "Bestone" / "Bestone Services Ltd" in all copy and metadata | Done |
| Components: Button, Price, PriceTile, PriceList, Facts, Plaque, Hallmarks, Stamp, Petals, FloorPlan, BigFacts, FaqSplit, SlimCta, Section | Done |
| Header (info row, grouped phone menu), footer legal line, phone sticky bar | Done |
| Homepage rebuilt from the library (S17, S24, S23, S35, S42, S40, S21, S38, S56, S57, S55, S58) | Done |
| Service page template for every service and location page (S16, S19, S25, S27, S35 B, S42, S37 piping, S55 B, S58 A) | Done |
| Service hubs (S18 wash hero with price list, priced cards, every other service as a list), gardening, removals | Done |
| About, contact (S11 B tiles, filled form), areas (S22), 404 (S61 C), legal reading pages | Done |
| Sweep: pills to 12px, dividing lines removed, filled inputs, eyebrow badges to plain eyebrows, heading weight 650 (`design/touchstone-sweep.py`) | Done |
| Menus show starting prices (S14); phone bottom tab bar replaced by the S12 B price bar | Done |
| Broken image paths pointed at approved photos; missing illustrations replaced with the four-petal mark | Done |
| Booking: day strip + sundial (R1 C+D), lime wash and gradient progress | Done |
| Prices, guides, blog and search: swept, not rebuilt | Partial |
| Booking confirmation and status, quote and invoice documents (S53, S54, S62–S64) | Next |
| Account and admin surfaces (S33, S60, S61) | Next |
| Live `/touchstone` component page | Later |
