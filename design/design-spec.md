# Best One Services — Website Design Specification

Status: design review only. This document does not approve any service, service area, price, contact detail, legal wording, or claim for publication.

## 1. Design direction

The proposed direction is **Calm Utility**: a light, editorial service website that feels professional and established without relying on ratings, badges, statistics, or invented proof.

The interface uses:

- a warm off-white canvas rather than stark white;
- deep evergreen for navigation, headings, and primary actions;
- a muted terracotta accent used sparingly for labels and wayfinding;
- generous whitespace and strong typographic hierarchy;
- restrained rounded corners and thin borders instead of heavy shadows;
- large, direct service choices so cleaning and pest control remain equally clear;
- replaceable photography frames that remain useful before approved assets exist.

### Visual tokens

| Token | Proposed value | Use |
| --- | --- | --- |
| Canvas | `#F6F7F2` | Main page background |
| Surface | `#FFFFFF` | Forms and contained content |
| Ink | `#17342F` | Primary text and dark surfaces |
| Evergreen | `#176453` | Primary actions and active states |
| Evergreen dark | `#0F493D` | Hover/pressed states |
| Mint wash | `#DDEBE5` | Quiet section backgrounds |
| Terracotta | `#C95F3D` | Small accents and section labels |
| Sand | `#E9E4D8` | Dividers and neutral illustration areas |
| Muted text | `#5E6C68` | Supporting copy |
| Border | `#CED8D3` | Dividers and field outlines |
| Error | `#A43D36` | Validation errors only |

Primary action text is white on evergreen. Terracotta is not used as body text on a light background.

### Typography

- Display and headings: **Manrope**, 600–700.
- Body and UI: **Inter**, 400–600.
- System fallbacks: `Arial, sans-serif`.
- Desktop hero: 56–64 px, with a short line length.
- Mobile hero: 38–44 px.
- Body copy: 17–18 px desktop and 16–17 px mobile.
- Minimum supporting text: 14 px.

Final implementation should self-host or use the framework’s font optimisation. The design prototype uses safe fallbacks when the web fonts are unavailable.

### Shape, spacing, and motion

- Content width: 1,200 px maximum.
- Reading width: 720 px maximum.
- Base spacing unit: 8 px.
- Common section spacing: 96 px desktop, 64 px tablet, 48 px mobile.
- Corners: 12 px controls, 18 px cards, 28 px feature panels.
- Shadows: only for elevated navigation or dialog states; normal cards use borders.
- Motion: 160–220 ms for hover/focus transitions. No scroll effects or decorative animation.
- Touch targets: minimum 44 × 44 px.

## 2. Primary user journeys

### Cleaning enquiry

Home → End of Tenancy Cleaning → understand scope/process → choose **Get a Free Quote** → cleaning-specific form fields → review consent → submit → truthful receipt message.

### Pest-control enquiry

Home → Pest Control → choose a confirmed treatment → understand process → choose **Request a Quote** → pest-specific form fields → review consent → submit → truthful receipt message.

### Informational visit

Search result → guide or verified area page → relevant service context → related service → quote form.

### Navigation rule

The main navigation keeps four decisions visible: **Services**, **Guides**, **About**, and **Get a Quote**. Service choices appear in a compact two-column panel. A phone CTA is not shown.

## 3. Sitemap and publishing state

### Public at launch after content/legal review

```text
/
/end-of-tenancy-cleaning/
/end-of-tenancy-cleaning/prices/
/end-of-tenancy-cleaning/checklist/
/pest-control/
/pest-control/prices/
/service-areas/
/guides/
/about/
/contact/
/privacy-policy/
/terms-and-conditions/
```

### Planned service pages — publish only after confirmation

```text
/rat-control/
/mice-control/
/bed-bug-treatment/
/cockroach-control/
/ant-control/
/flea-treatment/
/wasp-control/
/squirrel-control/
```

Each planned treatment has an `enabled` configuration field. Disabled routes must return 404 or remain unpublished; they must not appear in navigation, sitemap, internal links, or structured data.

### Generated only from verified records

```text
/end-of-tenancy-cleaning/[area]/
/pest-control/[area]/
/guides/[slug]/
```

Area pages require a verified service-to-area relationship and unique approved content. Draft, placeholder, or incomplete records are `noindex` and excluded from the sitemap.

### Private

```text
/admin/
/admin/enquiries/
/admin/content/
/admin/settings/
```

Admin routes require authorised authentication and must be `noindex`.

## 4. Page layouts

### 4.1 Home

**Goal:** let visitors identify the right service within seconds and start an enquiry without searching for contact details.

**Section order**

1. Slim design-review/launch notice when placeholders remain.
2. Header with logo wordmark, Services, Guides, About, and Get a Quote.
3. Hero:
   - eyebrow: “Cleaning and pest-control support”
   - H1: “A clearer way to arrange property services.”
   - short neutral introduction;
   - primary CTA: Get a Free Quote;
   - secondary CTA: Explore Services;
   - two direct service-path cards.
4. Brief introduction for the audiences supplied in the brief.
5. Split End of Tenancy Cleaning feature.
6. Split Pest Control feature.
7. How it works: Tell us what you need → We review the details → Agree the next step.
8. Why choose this process: clear information, tailored response, one enquiry path.
9. Planned service category grid, filtered by `enabled`.
10. Quote panel with a short progressive form entry point.
11. FAQ preview using approved FAQs only.
12. Footer with service links, guides, legal links, and a quote CTA.

**CTA placement:** header, hero, after each main service, after How it works, quote panel, footer.

**Mobile:** header becomes a sheet menu; hero CTAs stack; service paths become two full-width rows; alternating features use copy first and image second; FAQ remains single column; a bottom quote bar may appear after the hero but must not cover content.

### 4.2 End of Tenancy Cleaning

**Goal:** explain the purpose and route relevant visitors into a tailored cleaning enquiry.

**Section order**

1. Breadcrumb.
2. Service hero with one CTA and replaceable service image.
3. “Who this is for” audience chips: tenants, landlords, letting agents, property managers.
4. Scope overview with wording marked as draft until the business confirms inclusions.
5. Process timeline.
6. Property details callout linking to the cleaning quote step.
7. Checklist preview and cleaning-prices link.
8. Approved service-specific FAQs.
9. Related guides.
10. Cleaning-specific enquiry form.

**Mobile:** scope content becomes an accordion only if the approved copy is long; form is one column; the preferred-date input stays optional and never implies availability.

### 4.3 Pest Control

**Goal:** help users identify a pest issue, understand the enquiry process, and choose only a confirmed treatment.

**Section order**

1. Breadcrumb.
2. Service hero and quote CTA.
3. Treatment selector populated only from enabled services.
4. “What happens next” inspection/treatment discussion sequence using neutral language.
5. Property-context prompts for home, rental property, or commercial property.
6. Pest-control prices explainer with no invented amounts.
7. Approved FAQs and preparation guidance.
8. Relevant guides.
9. Pest-specific enquiry form.

**Mobile:** treatment cards become a single list with large tap targets; no hover-only detail; the selected pest pre-fills the form.

### 4.4 Individual pest-treatment template

**Goal:** answer treatment-specific questions and send a qualified enquiry while keeping every treatment independently publishable.

**Section order**

1. Template-status banner visible only in preview/admin.
2. Breadcrumb and treatment H1.
3. Neutral problem summary.
4. Possible signs section, reviewed before publication.
5. Service process.
6. Information to provide with the enquiry.
7. Treatment-specific FAQs.
8. Related confirmed services and guides.
9. Preselected pest enquiry form.

**Publishing gate:** requires `enabled = true`, approved title/description, approved service copy, confirmed coverage logic, and at least one meaningful FAQ or guide link. No unverified safety, licensing, guarantee, response-time, or effectiveness claim.

### 4.5 Service-area page template

**Goal:** confirm that a particular service is actually available in a verified area and provide genuinely local, useful information.

**Section order**

1. Preview banner until verified.
2. Breadcrumb.
3. H1: “[Service] in [Verified area]”.
4. Service and area availability statement from verified data.
5. Locally relevant property/service considerations written and reviewed per page.
6. Service process and enquiry CTA.
7. Links to the parent service, prices information, and relevant guide.
8. Area-specific FAQs only where factual.
9. Enquiry form with area preselected.

**Do not publish:** an area-name substitution of generic copy, empty local sections, or pages created from an unverified list.

### 4.6 Prices template

**Goal:** set honest expectations without publishing invented amounts.

**Section order**

1. Breadcrumb and H1.
2. Intro explaining that the final quote depends on submitted requirements.
3. “What shapes a quote” cards:
   - cleaning: property type, size/bedrooms, requested scope, timing information;
   - pest control: pest type, property context, reported issue, treatment requirements.
4. Future verified price table component, hidden while no approved figures exist.
5. What a quote request asks for.
6. FAQ.
7. Relevant enquiry form.

**Mobile:** factor cards stack; verified tables use labelled mobile rows instead of horizontal overflow where possible.

### 4.7 Guide/article template

**Goal:** answer a practical question and provide a relevant, non-intrusive next step.

**Section order**

1. Breadcrumb, category, title, summary, and verified publish date.
2. Replaceable editorial image.
3. Article body with a narrow reading measure.
4. In-article factual note/caution component.
5. Relevant service CTA after the visitor has received useful information.
6. Related guides.
7. Author label only if a real author/editor is supplied.

**Mobile:** sticky table of contents is replaced by an inline disclosure; service CTA stays in the normal document flow.

### 4.8 Contact / Get a Quote

**Goal:** collect the minimum useful information for a tailored response without requiring an account.

**Section order**

1. Short reassurance and truthful response expectation: the enquiry will be reviewed.
2. Step indicator: Service → Property/problem → Contact → Review.
3. Conditional form:
   - full name;
   - email address;
   - optional phone number;
   - service required;
   - property type;
   - bedrooms when cleaning is selected;
   - pest type when pest control is selected;
   - area/postcode;
   - preferred date;
   - optional message;
   - required privacy consent.
4. Inline validation, retry/error state, and privacy notice.
5. Receipt state: “Thanks. Your enquiry has been received. We will review your requirements and contact you using the details provided.”

**Mobile:** one question group per viewport section, normal page scrolling, persistent progress summary, no modal keyboard traps.

### 4.9 About

**Goal:** explain what the business focuses on and how the enquiry process works without inventing history, team size, credentials, or values claims.

**Section order**

1. H1 and supplied business description.
2. Two areas of focus.
3. Audiences served, based on the supplied list.
4. How enquiries are handled.
5. Replaceable business/team image area.
6. CTA to contact.

**Not included until supplied:** founding story, team biographies, office, certifications, memberships, coverage claims, or numerical proof.

### 4.10 Mobile navigation and mobile home

**Navigation**

- 56–64 px top bar with wordmark and labelled Menu control.
- Menu opens a full-width sheet below the header, not a tiny dropdown.
- Main service links are visible before secondary links.
- Quote CTA spans the menu width.
- Escape key and outside click close the sheet; focus returns to Menu.

**Home**

1. Short eyebrow and two-to-three-line H1.
2. Stacked primary and secondary actions.
3. Two full-width service choices.
4. Intro.
5. Cleaning feature.
6. Pest-control feature.
7. Three-step process.
8. Enabled services list.
9. FAQ.
10. Quote CTA.
11. Footer.

## 5. Reusable component inventory

### Global

- `SiteHeader`
- `MobileMenu`
- `Breadcrumbs`
- `Footer`
- `LaunchNotice`
- `SectionHeading`
- `PrimaryButton`
- `SecondaryButton`
- `TextLink`
- `ImagePlaceholder`
- `EmptyState`
- `ErrorState`
- `LoadingSkeleton`
- `CookieConsent`

### Content

- `Hero`
- `ServicePathCard`
- `ServiceCard`
- `AudienceList`
- `ProcessSteps`
- `BenefitList`
- `ContentSplit`
- `FaqAccordion`
- `GuideCard`
- `RelatedLinks`
- `QuoteFactors`
- `ArticleCallout`
- `ServiceAvailabilityNotice`

### Forms

- `QuoteForm`
- `FormStep`
- `TextField`
- `SelectField`
- `DateField`
- `CheckboxField`
- `InlineError`
- `SubmissionStatus`
- `PrivacyNotice`

### SEO/system

- central `siteConfig`;
- route metadata factory;
- service and guide content schemas;
- JSON-LD helpers that render only verified facts;
- sitemap filter for enabled/published records;
- robots rules for admin and draft routes.

## 6. Content and configuration model

The website and future Flutter app should share the same business records. The design assumes these future collections:

| Collection | Purpose | Public read |
| --- | --- | --- |
| `settings` | approved site identity, CTAs, contact fields, branding, analytics flags | selected published fields only |
| `serviceCategories` | Cleaning and Pest Control grouping | published records |
| `services` | service pages, enabled status, enquiry fields, SEO | enabled and published records |
| `faqs` | approved FAQs linked to pages/services | published records |
| `guides` | guide metadata and content | published records |
| `serviceAreas` | verified service-to-area availability and unique copy | published records |
| `enquiries` | customer submissions and status | no customer list/read |
| `adminUsers` | admin authorisation metadata | admin only |

Enquiry statuses: `new`, `contacted`, `quoted`, `booked`, `closed`.

Enquiry sources: `website`, `mobile_app`.

The design does not require a customer account.

## 7. Imagery direction

- Home: one authentic property-service context image, showing the environment rather than an identifiable customer.
- Cleaning: furnished or empty rental-property cleaning context.
- Pest control: professional inspection context without graphic pest imagery.
- Guides: simple editorial crops relevant to the article.
- About: real business/team image only when supplied.

Until approved assets exist, use labelled neutral frames. Do not use fabricated staff, customers, badges, vehicles, uniforms, before/after results, or branded equipment.

## 8. Accessibility and responsive behaviour

- One H1 per page and semantic landmark order.
- Visible keyboard focus on every interactive element.
- No interaction relies on hover.
- Form errors identify the field and explain the correction.
- Error summary links back to invalid fields on long forms.
- Accordion controls expose expanded/collapsed state.
- Images have useful alt text; decorative images use empty alt text.
- Reduced-motion preference disables nonessential transition movement.
- Layout targets: 320 px small mobile, 768 px tablet, 1,024 px laptop, 1,440 px desktop.
- Content reflows rather than shrinking; no fixed-width form controls.

## 9. SEO design guardrails

- Every core route has a unique title, description, canonical URL, and H1.
- Placeholder and preview routes are `noindex`.
- Area pages are generated only from verified service-area records with unique approved local content.
- Disabled services are absent from the sitemap and internal linking.
- Structured data omits telephone, address, opening hours, ratings, reviews, prices, coordinates, and other unsupplied facts.
- Guides link to relevant confirmed services; services link to approved guides and prices/checklist content.
- The footer does not become a keyword-heavy list of hundreds of areas.

## 10. Analytics, consent, and maintenance

- Analytics and Search Console have configuration points only; no IDs are added yet.
- Nonessential analytics remain disabled until consent and IDs are configured.
- Every quote form has a privacy notice.
- Central configuration controls contact data, branding, CTA labels, enabled services, verified areas, and image assets.
- Admin and draft routes remain private and unindexed.
- Enquiry export/backup is documented before launch.

## 11. Approval gates

Design approval confirms only:

1. visual direction;
2. page hierarchy;
3. component patterns;
4. mobile behaviour;
5. enquiry flow.

Implementation should begin only after approval. Launch readiness additionally requires the items in `launch-checklist.md`.
