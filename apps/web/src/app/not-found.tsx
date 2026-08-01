import { ButtonLink } from "@/components/button-link";

export default function NotFound() {
  return (
    <main id="main-content" className="section">
      <div className="shell reading">
        <p className="eyebrow">Page not found</p>
        <h1>We could not find that page.</h1>
        <p className="lead">The address may be incorrect, or the page may have moved.</p>
        <ButtonLink href="/">Return to Home</ButtonLink>
      </div>
    </main>
  );
}
