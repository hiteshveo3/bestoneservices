# Firebase M0 configuration plan

## Environments

Use separate Firebase projects for development, staging and production. Keep all credentials in host secrets or uncommitted `.env.local` files.

## M0 security baseline

- Firestore and Storage client access are default-deny.
- Public Firebase values and server-only Admin credentials are separated in `.env.example`.
- No booking, email, payment or review provider is enabled without owner configuration.

## M2 prerequisites

Before booking launch: configure Firebase Auth domains, App Check, Firestore indexes/rules, rate limiting, transactional email adapter and a tested server-side booking workflow.
