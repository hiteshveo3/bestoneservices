# Best One Services platform

## M2 configuration

Set Firebase server credentials (`FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`) and public web credentials (`NEXT_PUBLIC_FIREBASE_*`) in the host environment. Enable Email/Password and email verification in Firebase Auth, add approved Auth domains, and provision a role using either a Firebase custom claim (`role: admin` or `staff`) or `users/{uid}.role`.

Bookings are created server-side through `/api/bookings`; Firestore clients cannot create or modify bookings directly. Set `EMAIL_PROVIDER`, `EMAIL_FROM`, `EMAIL_REPLY_TO` and `EMAIL_API_KEY` only after choosing an approved provider. The adapter remains disabled without them.

## M3 mobile

Run `flutter pub get` in `apps/mobile`, configure generated Firebase options for each environment, then enable Firebase Auth and the shared booking API. No production mobile configuration is committed.

## Verification

Run `npm run lint`, `npm run typecheck` and `npm run build` from `apps/web`; run `flutter analyze` and `flutter test` from `apps/mobile`. Current local build verification is blocked until disk space and stale generated Next files are resolved.
