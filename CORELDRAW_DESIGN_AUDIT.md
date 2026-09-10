# CorelDRAW live design-system audit

Date: 2026-08-31

## Live reference inspected

- URL: `https://www.coreldraw.com/en/`
- Desktop: 1440 × 1000, 1280 × 900, 1024 × 900
- Tablet: 768 × 900
- Mobile: 390 × 844
- Interactions inspected: desktop Products mega menu, mobile menu trigger, primary/secondary hero CTAs, announcement bar, live footer structure.

## Verified reference system

### Typography

| Role | Live value |
| --- | --- |
| Base family | `NB-International, -apple-system, BlinkMacSystemFont, sans-serif` |
| Base text | 16px / 400 / 24px |
| Desktop hero H1 | 40px / 400 / 48px / −0.8px tracking |
| 1024 hero H1 | 37.36px / 400 / 44.832px / −0.8px tracking |
| 768 hero H1 | 33.52px / 400 / 40.224px / −0.8px tracking |
| 390 hero H1 | 27.85px / 400 / 33.42px / −0.8px tracking |
| Section H2 | 32px / 500 / 40px |
| Desktop nav | 16px / 400 / 24px |
| Primary and secondary CTA | 16px / 500 / 44px control height |

`NB-International` is the actual live font. It is not currently bundled with the project, so the implementation will use the closest legal system fallback until a licensed font asset is supplied.

### Core colours

| Semantic role | Live value |
| --- | --- |
| Primary CTA | `#0067CB` / `rgb(0, 103, 203)` |
| Primary CTA hover | `#0052A3` / `rgb(0, 82, 163)` |
| Primary CTA focus/soft blue | `#7CBDFF`, `#D3E9FF` |
| Promotion magenta | `#CC1275` |
| Lavender label surface | `#D1C3F5` |
| Pale pink support surface | `#FDF2F8` |
| Primary text | `#000000` |
| Secondary text | `#333333`, `#494D56` |
| Borders | `#DEDEDE`, `#E6E6E6` |
| White surface | `#FFFFFF` |

### Layout and shapes

- Desktop announcement bar: 56px high; mobile expands to 94px for wrapped content.
- Desktop navigation: approximately 71px high; mobile navigation: 53px high.
- Desktop hero: editorial 44/56 text-to-media composition.
- Primary and secondary buttons: 44px high, 24px horizontal padding, `100px` radius, 2px border.
- Hero and navigation surfaces: white, minimal shadow, fine neutral dividers.
- Products navigation: full-width multi-column mega menu with page-dimming overlay, not a floating rounded card.
- Mobile navigation: compact hamburger + centred logo; desktop nav links are removed.
- Footer: dense, white, multi-column link architecture; mobile stacks link groups.

## Existing-project legacy inventory

- App Router under `apps/web/src/app`.
- Public routes include homepage, service/category pages, prices, booking, contact, guides, blog, areas, legal routes, invoices and quotes.
- Account and admin routes share the same global visual token file and need the same foundation but retain semantic status colours.
- Root visual system: `apps/web/src/app/globals.css`.
- Shared chrome: `site-header.tsx`, `desktop-mega-menu.tsx`, `mobile-bottom-nav.tsx`, `site-footer.tsx`, `search-modal.tsx`.
- Shared UI: booking, forms, service cards, calculators, galleries, reviews, modals, and dashboards.
- Legacy conflicts found: Google-green token system, service-specific colours, hard-coded `#005143` CTAs, and `theme-palette.tsx` / `header-palette-switcher.tsx` runtime themes.
- Repository-wide style scan: 1,431 matching visual declarations before the Corel migration.

## Migration map

| Existing role | CorelDRAW-derived role | Implementation target |
| --- | --- | --- |
| Green page and card surfaces | White / pale neutral surfaces | root surface tokens |
| Forest-green CTA | Blue primary CTA | `--cta-fill: #0067CB` |
| Rounded service cards | Fine-border content modules | shared card and section rules |
| Runtime palette switcher | Single consistent visual system | remove from chrome and root provider |
| Heavy, inconsistent headings | Editorial 400/500 hierarchy | global typography roles |
| Pill navigation | Plain nav links with a fine active underline | header and mega menu |
| Existing hero mascot grid | 44/56 editorial text/media split | `hero-home.tsx` |
| Green footer | Dense white Corel-inspired footer | `site-footer.tsx` |

## Implementation queue

1. Replace global tokens, typography, borders, radii, form and button foundations.
2. Remove the runtime palette switcher and migrate header/navigation/mega menu/mobile navigation.
3. Restyle footer and shared components.
4. Restyle homepage, services, pricing, booking, contact, guides/blog/areas and legal routes.
5. Apply the shared foundation to account/admin routes without changing logic.
6. Purge legacy colours, typography, radii and shadows; then run responsive and functional QA.
