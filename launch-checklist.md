# Best One Services — Launch Checklist

The design may be approved before these items are complete. The website must not be described as launch-ready until every required item has been supplied, reviewed, implemented, and tested.

## Business facts

- [ ] Phone number, if the business wants it published
- [ ] Enquiry/contact email address
- [ ] Registered or trading address, only if it should be published and legally appropriate
- [ ] Confirmed business opening/contact hours, if they should be shown
- [ ] Confirmed service coverage
- [ ] Confirmed list of pest-control treatments actually provided
- [ ] Confirmed end-of-tenancy cleaning scope and exclusions
- [ ] Confirmed pest-control process wording and preparation advice
- [ ] Confirmed price information, or approval to keep quote-only wording
- [ ] Verified business credentials, licences, insurance, memberships, and guarantees, if any are to be claimed
- [ ] Real business/team details for the About page

## Content and assets

- [ ] Approved logo/wordmark
- [ ] Approved brand colours and fonts
- [ ] Real service photography with documented usage rights
- [ ] Approved service-page copy
- [ ] Approved FAQs
- [ ] Approved guides/articles and factual review
- [ ] Unique approved copy for every future service-area page
- [ ] Image alt text review
- [ ] Favicon, app icons, and social-preview image
- [ ] Confirmation that no competitor copy or unlicensed assets are used

## Legal and privacy

- [ ] Privacy policy reviewed for the actual data flow and business jurisdiction
- [ ] Terms and conditions reviewed
- [ ] Cookie-consent wording and categories reviewed
- [ ] Enquiry consent wording reviewed
- [ ] Data retention period confirmed
- [ ] Data access, correction, and deletion process documented
- [ ] Optional phone-number handling reviewed
- [ ] Legal basis and provider terms reviewed before analytics is enabled

## Firebase and security

- [ ] Production Firebase project created
- [ ] Separate development/emulator configuration confirmed
- [ ] Firebase Authentication configured for admins only
- [ ] Admin custom-claim or equivalent authorisation process documented
- [ ] Firestore rules deployed and tested
- [ ] Storage rules deployed and tested
- [ ] Firebase App Check configured
- [ ] Server-side Zod validation enabled for every enquiry write
- [ ] Rate limiting and spam protection configured and tested
- [ ] Customers cannot list or read enquiries
- [ ] Unauthorised users cannot access or update admin data
- [ ] Enquiry status transitions tested
- [ ] Backup/export approach tested
- [ ] No admin credential or secret exists in browser/mobile code

## Forms

- [ ] Required and conditional fields verified
- [ ] Privacy consent is required
- [ ] Duplicate submission protection tested
- [ ] Loading, validation, offline, error, retry, and success states tested
- [ ] Receipt wording is truthful and does not promise a booking
- [ ] Preferred date does not imply availability or confirmation
- [ ] Submission source recorded as `website` or `mobile_app`
- [ ] Created and updated timestamps use trusted server time
- [ ] Enquiry status defaults to `new`
- [ ] Verified sending domain and email provider configured before any email is sent

## SEO and indexing

- [ ] Unique title, description, canonical, and H1 checked on every public route
- [ ] Open Graph metadata checked
- [ ] `sitemap.xml` includes only published, canonical pages
- [ ] `robots.txt` checked
- [ ] Drafts, previews, placeholders, and admin routes are `noindex`
- [ ] Disabled treatments are absent from navigation, sitemap, and internal links
- [ ] Every area page has verified coverage and unique useful local content
- [ ] Structured data contains only verified facts
- [ ] Google Search Console verification value supplied
- [ ] Production domain and canonical base URL configured
- [ ] 404 and error pages tested

## Analytics and consent

- [ ] Analytics property and ID supplied
- [ ] Search Console property configured
- [ ] Nonessential analytics blocked before consent
- [ ] Consent preferences can be changed or withdrawn
- [ ] Analytics remains disabled where consent is not provided

## Quality assurance

- [ ] Production build passes
- [ ] Lint passes
- [ ] Strict TypeScript check passes
- [ ] Unit and integration tests pass
- [ ] Keyboard navigation tested
- [ ] Screen-reader labels and form errors checked
- [ ] Colour contrast checked
- [ ] 320 px mobile layout checked
- [ ] Common Android and iOS viewport layouts checked
- [ ] Tablet and desktop layouts checked
- [ ] Slow-network and image-loading behaviour checked
- [ ] Core Web Vitals reviewed
- [ ] Authenticated admin access checked
- [ ] Unauthenticated admin blocking checked
- [ ] Firestore emulator/rules tests pass
- [ ] Production enquiry flow tested end to end

## Deployment and operations

- [ ] Vercel project and environment variables configured
- [ ] `.env` files excluded from Git
- [ ] Custom domain and DNS configured
- [ ] HTTPS verified
- [ ] Firebase authorised domains configured
- [ ] Production error monitoring decision made
- [ ] Rollback process documented
- [ ] Content editing instructions reviewed with the business
- [ ] Enquiry ownership and response process assigned
- [ ] Backup/export schedule assigned

## Intentionally excluded from phase one

- Online payments
- Live booking calendar
- Real-time availability
- Automatic price calculator
- Staff assignment
- GPS tracking
- In-app chat/live chat
- SMS
- Automated email sending
- Google Maps
- Customer reviews
- Referral or loyalty features
- Multi-language support
- Separate admin mobile application
