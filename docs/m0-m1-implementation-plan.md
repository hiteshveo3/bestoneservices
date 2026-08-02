# M0 + M1 implementation plan

## M0 — foundation

1. Keep `apps/web` as the current Next.js App Router application.
2. Reserve `apps/mobile` for the Flutter product delivered in M5.
3. Add Firebase deployment assets, default-deny Firestore/Storage rules and empty index configuration.
4. Separate public configuration from server-only credentials and feature flags.
5. Keep phone, app links, booking, payments and provider integrations disabled until owner configuration is supplied.

## M1 — public website

1. Use the existing sage/sand design system: warm neutral canvas, sage action colour, Arial typography, low-shadow cards, accessible focus states and mobile-first responsive layouts.
2. Navigation exposes only End of Tenancy Cleaning and Pest Control plus About, Areas and Contact.
3. Preserve legacy cleaning/pest service URL paths through dynamic, validated route catalogues.
4. Keep removal and gardening route catalogues reserved, not rendered, not linked and not indexed.
5. Drive sitemap inclusion only from approved records in `src/content/page-registry.ts`.
6. Public route content needs approved capability, price context, inclusions/exclusions, FAQ and internal links before publishing/indexing.

## M2 hand-off

`/booking/` becomes the guest booking wizard only after Firebase Auth/Firestore/App Check, server validation, legal consent records, transactional email adapter and idempotent booking creation are configured.
