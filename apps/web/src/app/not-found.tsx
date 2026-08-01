import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <main id="main-content" className="section">
      <div className="shell reading">
        <p className="eyebrow">Page not found</p>
        <h1>We could not find that page.</h1>
        <p className="lead">The link may be outdated or the requested service page may not have been published yet.</p>
        <ButtonLink href="/">Return to Home</ButtonLink>
      </div>
    </main>
  );
}
