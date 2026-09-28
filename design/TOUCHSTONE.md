# Touchstone — the Bestone design system

> **Touchstone**: the dark stone goldsmiths rubbed gold on to read its purity.
> In everyday English, the standard everything else is judged by.
> Bestone → be·**stone**.

This file is the source of truth for decisions. The live experiments are in
`design/lab/` (open `index.html` for the current lab, `01-name.html` for Lab 01).
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

## Open

- Visual direction (Lab 02: Portland, Lime-led or Record).
- Proofs from the client: CRRU-approved rodenticide certificate, waste carrier registration number, insurance (public liability, employer's liability, goods in transit), DBS checks.
- Which phone number is official (020 8079 7336 on the site, 07729 861195 in directories).
- Re-clean guarantee length: 48 hours today; competitors offer 72 hours or 7 days.
- Before launch: redirect map for live URLs missing from the new build (carpet beetles, silverfish, moth, spider and others), and one host (www or bare) with the other redirected.

## Working method

- Labs are static pages in `design/lab/`, viewed through raw.githack from the `claude/sharp-hawking-iytf87` branch.
- `vercel.json` and `apps/web/vercel.json` skip deployments for `claude/**` branches, so lab pushes cost no Vercel builds.
