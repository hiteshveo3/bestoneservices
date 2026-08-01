# Best One Services web app

Production Next.js App Router foundation for the Best One Services website.

## Current routes

- `/` — home page
- `/end-of-tenancy-cleaning/` — approved cleaning-service direction
- `/get-a-quote/` — accessible conditional quote form
- `/api/enquiries` — validated, server-only Firestore submission endpoint
- `/sitemap.xml` — published routes only
- `/robots.txt` — crawler controls
- `/llms.txt` — concise, optional AI discovery summary

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Copy `.env.example` to `.env.local` only when Firebase credentials are available. Never commit a service-account key.

The form uses the Firebase Admin SDK on the server and writes validated records to the `enquiries` collection. In Firebase App Hosting or another Google environment, Application Default Credentials are preferred. For local development, use `GOOGLE_APPLICATION_CREDENTIALS` or the three explicit `FIREBASE_*` values shown in `.env.example`.

## Verification

```bash
npm run lint
npm run typecheck
npm run build
npm audit --omit=dev
```

## Architecture

- `src/app` — App Router routes and metadata files
- `src/components` — reusable page, navigation, FAQ and CTA components
- `src/config/site.ts` — business identity and contact details
- `src/content` — factual page content kept outside presentation components
- `src/content/page-registry.ts` — approved keyword targets and the indexable sitemap source
- `src/lib/structured-data.ts` — JSON-LD builders that mirror visible content
- `public/images` — optimized local imagery

## SEO and AI-search rules

- Only published, indexable records in `src/content/page-registry.ts` appear in the sitemap.
- Unverified area/service combinations must not be generated or indexed.
- Structured data must match visible page text.
- OAI-SearchBot is allowed for ChatGPT Search discovery.
- GPTBot is blocked separately; search discovery does not require training access.
- `llms.txt` is an optional summary and is not treated as a ranking requirement.
- Important service information is rendered as crawlable server HTML.

## Business information still required

- Verified service areas
- Confirmed pest-control treatments
- Final prices and inclusions
- Insurance, training or guarantee wording, if the business chooses to publish it
- Real approved customer reviews
- Real consented before/after photography
- Legal review of privacy policy and terms

Do not add any missing fact by assumption.
