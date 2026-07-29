# Best One Services — Customer App IA and UX Specification

Status: design and information architecture only. No Flutter implementation, Firebase connection, notifications, or data submission is included in this phase.

## 1. Product goal

The Android and iOS app helps a guest:

1. understand End of Tenancy Cleaning or Pest Control;
2. choose a relevant, confirmed service;
3. submit a quote/enquiry with the details needed for review.

The app is not a smaller copy of the website. It uses short mobile-native journeys, progressive forms, large touch targets, and clear recovery states.

Phase one has:

- no required customer account;
- no separate admin mobile application;
- no instant booking, availability, payment, price calculator, or chat;
- no phone CTA;
- no notification prompt at first launch.

“Book a Service” is a label for the same enquiry flow and must never imply a confirmed booking.

## 2. Navigation model

Primary bottom navigation:

1. **Home**
2. **Services**
3. **Guides**
4. **Get a Quote**

Rules:

- Bottom navigation remains visible on root screens.
- Detail screens use a normal app bar with a back action.
- A service or guide deep link opens the detail screen directly.
- The quote flow can open as a full-screen nested route with its own progress header.
- Contact/support and legal pages are available from the Home overflow/settings entry and relevant form links.
- No customer-profile tab is included in phase one.

## 3. Information architecture

```text
App
├── Home
│   ├── End of Tenancy Cleaning
│   ├── Pest Control
│   ├── Popular confirmed services
│   ├── Helpful guides
│   ├── FAQ preview
│   └── Contact / support
├── Services
│   ├── End of Tenancy Cleaning
│   ├── Pest Control
│   └── Confirmed treatment detail
├── Guides
│   ├── Guide list
│   └── Published guide detail
├── Get a Quote
│   ├── Service
│   ├── Property / problem
│   ├── Area and preferred date
│   ├── Contact
│   ├── Review and consent
│   └── Receipt
└── More / support
    ├── Contact / support
    ├── Privacy Policy
    └── Terms and Conditions
```

## 4. Screen inventory

### App foundations

| Screen/state | Purpose |
| --- | --- |
| Launch | Brand mark while local configuration initialises; no marketing claims |
| First-load skeleton | Preserve layout while published data is read |
| Offline | Explain that content may be unavailable and provide Retry |
| Global error | Safe message with Retry; no technical details |
| Maintenance/configuration empty state | Explain that content is being prepared; do not show empty fake services |

No promotional onboarding carousel is needed. Home opens after launch.

### Home

**Goal:** choose cleaning or pest control and begin a quote within two taps.

**Order**

1. Compact app bar with brand name and support/more action.
2. H1-style introduction: “Property services, made easier to arrange.”
3. Primary Get a Free Quote button.
4. Two large service cards:
   - End of Tenancy Cleaning;
   - Pest Control.
5. How it works: Share details → Review → Agree the next step.
6. Popular services, showing enabled records only.
7. Helpful published guides.
8. FAQ preview.
9. Repeat quote CTA.

The first screen does not show a phone number, rating, review, counter, badge, price, coverage claim, or notification prompt.

### Services

**Goal:** browse the two categories and confirmed individual services.

**Content**

- Category toggle or two top-level cards.
- Service list filtered by `enabled` and `published`.
- Short summary and clear chevron per service.
- Empty state if a category has no confirmed public treatments.
- Search is omitted in phase one because the list is small.

### End of Tenancy Cleaning detail

**Goal:** explain the move-out cleaning use case and collect a cleaning-specific enquiry.

**Order**

1. Replaceable service image.
2. Clear title and neutral summary.
3. Who the service is for.
4. Approved scope overview.
5. Process steps.
6. Checklist link.
7. Approved FAQs.
8. Sticky-in-flow Get a Cleaning Quote button.

The CTA opens the quote flow with Cleaning preselected.

### Pest Control detail

**Goal:** help the user select a confirmed pest treatment or submit an “unsure” enquiry.

**Order**

1. Replaceable inspection image.
2. Clear title and neutral summary.
3. Enabled treatment selector.
4. What information to provide.
5. Approved process wording.
6. Helpful published guides.
7. Approved FAQs.
8. Request a Quote CTA.

### Individual treatment detail

Reusable for:

- Rat Control
- Mice Control
- Bed Bug Treatment
- Cockroach Control
- Ant Control
- Flea Treatment
- Wasp Control
- Squirrel Control

Every screen is configuration-controlled. A treatment that is not confirmed must be absent from lists and deep-link resolution.

**Order**

1. Title and approved neutral summary.
2. Approved possible-signs information.
3. Service process.
4. What to include in the enquiry.
5. Treatment-specific FAQs.
6. Related published guide.
7. Quote CTA with pest type preselected.

### Guides list

**Goal:** browse only published guidance.

**Content**

- Category chips: All, Cleaning, Pest Control; hide empty categories.
- Guide card: image, category, title, summary, publish date.
- Loading skeleton, empty state, offline state, retry.
- Pagination/infinite loading only when genuinely needed.

### Guide detail

**Content**

- Category, title, summary, verified publish date.
- Replaceable image with loading and error fallback.
- Readable article body.
- Factual callout component.
- Relevant confirmed service CTA.
- Related guides.

Author details are omitted unless a real author/editor is provided.

### Contact / support

**Goal:** route the user into a useful enquiry without a phone number.

**Content**

- Short explanation.
- Get a Free Quote.
- Request a Callback.
- Privacy Policy and Terms links.
- Future email/address fields are hidden until supplied and approved.

### Privacy Policy and Terms

- Render approved legal content from a published record or bundled approved fallback.
- Display last-reviewed date only when supplied.
- Support deep links from consent and app settings.
- Do not invent a company address, registration detail, or contact address.

## 5. Quote flow

The quote flow is a five-step full-screen route. Progress is saved in memory during the flow. A local draft is optional and must remain disabled until privacy handling is approved.

### Step 1 — Service

- End of Tenancy Cleaning
- Pest Control
- Confirmed individual treatment when entered from a service detail

The user can change the preselected service.

### Step 2 — Property or problem

Cleaning fields:

- Property type
- Bedroom count
- Optional scope/message

Pest fields:

- Pest type, including “Other / unsure”
- Property type
- Description of signs/problem

Image upload is excluded from phase one unless storage security, file type, size, retention, and consent are separately approved.

### Step 3 — Location and preference

- Area or postcode
- Preferred date

Helper text: a preferred date does not confirm availability or a booking.

### Step 4 — Contact

- Full name
- Email address
- Optional phone number

The app never displays a business phone number in phase one.

### Step 5 — Review and consent

- Editable summary of all provided fields
- Required Privacy Policy consent checkbox
- Send Enquiry button
- Loading state prevents repeat taps

### Receipt

Use exactly this truthful message:

> Thanks. Your enquiry has been received. We will review your requirements and contact you using the details provided.

Receipt actions:

- Return Home
- View relevant service

Do not show a booking reference, time estimate, appointment, quote amount, or success claim unless the backend actually supplies verified data for it.

## 6. Flow diagrams

### Cleaning

```text
Home / Services
  → End of Tenancy Cleaning
  → Get a Cleaning Quote
  → Property type
  → Bedrooms
  → Area/postcode
  → Preferred date
  → Optional notes
  → Contact details
  → Privacy consent and review
  → Send
  → Receipt
```

### Pest control

```text
Home / Services
  → Pest Control
  → Confirmed treatment or Other/unsure
  → Treatment detail (when available)
  → Request a Quote
  → Property type
  → Problem details
  → Area/postcode
  → Preferred date
  → Contact details
  → Privacy consent and review
  → Send
  → Receipt
```

### Failure and retry

```text
Send
  → Loading
  → Success → Receipt
  → Offline/error → Keep entered data in memory
                  → Explain failure
                  → Retry with the same idempotency key
                  → Success without duplicate enquiry
```

## 7. Mobile visual direction

The app shares the website’s calm visual identity:

- warm off-white background;
- evergreen primary actions and headings;
- mint quiet surfaces;
- terracotta used sparingly for labels;
- Manrope headings and Inter body text;
- restrained 12–20 px corners;
- borders rather than heavy shadows.

Material 3 adapts the tokens to native controls. Platform behaviour remains familiar:

- native date picker;
- system keyboard and autofill;
- standard back gestures;
- bottom navigation;
- scrollable page layouts rather than web-like modal forms.

### Sizing

- 16 px minimum body text.
- 48–56 px primary button height.
- 48 px minimum list-row/touch target.
- 16–20 px horizontal phone padding.
- 24–32 px major card spacing.
- 600 px content maximum on tablets; avoid stretching forms edge to edge.

### Motion

- Short Material transitions between routes.
- No decorative looping animation.
- Loading skeletons do not pulse when reduced motion is enabled.
- Receipt state uses a static confirmation icon, not confetti.

## 8. Key mobile wireframes

### Home

```text
┌─────────────────────────────┐
│ Best One Services        ⋯  │
├─────────────────────────────┤
│ Property services, made     │
│ easier to arrange.          │
│ [ Get a Free Quote       ]  │
│                             │
│ ┌─────────────────────────┐ │
│ │ End of Tenancy Cleaning│ │
│ │ Rental-property handover│ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Pest Control           │ │
│ │ Common pest problems   │ │
│ └─────────────────────────┘ │
│                             │
│ How it works                │
│ 1 Share  2 Review  3 Agree  │
│                             │
│ Helpful guides              │
├─────────────────────────────┤
│ Home  Services  Guides Quote│
└─────────────────────────────┘
```

### Quote step

```text
┌─────────────────────────────┐
│ ‹  Get a quote        2 of 5│
│ ● ● ○ ○ ○                   │
├─────────────────────────────┤
│ Tell us about the property  │
│                             │
│ Property type               │
│ [ Select                 ▾ ] │
│                             │
│ Bedrooms                    │
│ [ Select                 ▾ ] │
│                             │
│ Optional notes              │
│ [                         ] │
│ [                         ] │
│                             │
│ [ Continue                ] │
└─────────────────────────────┘
```

### Receipt

```text
┌─────────────────────────────┐
│             ✓               │
│ Enquiry received            │
│                             │
│ Thanks. Your enquiry has    │
│ been received. We will      │
│ review your requirements... │
│                             │
│ [ Return Home             ] │
│   View relevant service     │
└─────────────────────────────┘
```

## 9. Reusable UI components

- `AppScaffold`
- `PrimaryAppBar`
- `BottomNavigation`
- `PrimaryButton`
- `SecondaryButton`
- `ServiceCard`
- `GuideCard`
- `SectionHeader`
- `ProcessSteps`
- `FaqAccordion`
- `PublishedImage`
- `LoadingSkeleton`
- `EmptyState`
- `OfflineState`
- `ErrorState`
- `QuoteProgress`
- `QuoteSummary`
- `ValidatedTextField`
- `ValidatedSelectField`
- `ConsentField`
- `SubmissionState`
- `PrivacyNotice`

Components use semantic labels and do not hide important content behind icon-only actions.

## 10. Data and state design

Future Flutter implementation:

- feature-first packages;
- Riverpod for asynchronous published content and quote flow state;
- GoRouter for root navigation, nested service routes, quote steps, and deep links;
- immutable typed models;
- repositories separating Firestore from UI;
- local preferences only for safe UI choices;
- no local draft persistence until consent/retention is approved.

Shared collections:

| Collection | App use |
| --- | --- |
| `settings` | published identity, brand tokens, support options, feature flags |
| `serviceCategories` | Cleaning and Pest Control |
| `services` | enabled/published service detail |
| `faqs` | approved page/service FAQs |
| `guides` | published guide list and content |
| `serviceAreas` | verified availability, used for validation or messaging |
| `enquiries` | secure write path only |
| `adminUsers` | not read by the customer app |

## 11. Security and submission UX

- Customer never lists or reads enquiries.
- Enquiry creation passes server-side validation and rate limiting.
- App Check is required in production.
- An idempotency key prevents duplicate enquiries on retry.
- Firebase admin credentials never ship in the app.
- Optional phone data is collected only in the form.
- Storage upload remains off until separately approved.
- Error messages never reveal Firestore rules, document paths, or internal IDs.

## 12. Notifications

Notification permission is not requested at launch.

After successful submission, an optional control may ask whether the customer wants status notifications. It appears only after:

1. the notification design is approved;
2. Firebase Cloud Messaging is configured;
3. consent and token-retention handling are reviewed.

Allowed neutral notification:

> Your enquiry has been received.

No notification promises an appointment or quote unless a verified admin action has produced that state.

## 13. Accessibility

- Text supports platform font scaling without clipping.
- Controls have semantic names and hints.
- Colour is never the only status indicator.
- Focus order follows visual order.
- Form errors are announced and tied to fields.
- Bottom-nav labels remain visible.
- Small Android screens are the baseline.
- Tablet layouts centre content rather than creating oversized cards.
- Reduced motion and high contrast are respected.

## 14. Validation and test plan for implementation

- Unit tests for conditional validation, typed mapping, repository retry, and idempotency.
- Widget tests for bottom navigation, service card, quote steps, consent, loading, offline, and error states.
- Integration test for Cleaning enquiry from Home to receipt.
- Integration test for Pest Control enquiry from service detail to receipt.
- Duplicate-submit and retry test.
- Deep-link tests for enabled service, disabled service, published guide, and missing guide.
- Firestore rule tests proving customers cannot list/read enquiries.
- Small Android, current iPhone, large phone, and tablet layout tests.
- Screen reader and text scaling tests.

## 15. Approval gate

Approve before Flutter coding:

1. navigation labels;
2. visual direction;
3. service-detail structure;
4. five-step quote flow;
5. guest-only phase-one decision;
6. notification permission timing;
7. content and treatment publishing gates.

Missing business and production inputs remain in `launch-checklist.md`.
