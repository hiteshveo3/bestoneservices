"use client";

import { useState, type FormEvent } from "react";
import { CheckmarkCircle02Icon, InformationCircleIcon } from "@hugeicons/core-free-icons";
import { DecorativeIcon } from "@/components/decorative-icon";
import { siteConfig } from "@/config/site";

type ServiceValue = "end-of-tenancy-cleaning" | "pest-control";
type FieldErrors = Record<string, string[] | undefined>;

type SubmissionState = {
  status: "idle" | "submitting" | "success" | "error";
  message?: string;
  reference?: string;
  errors?: FieldErrors;
};

function FieldError({ field, errors }: { field: string; errors?: FieldErrors }) {
  const message = errors?.[field]?.[0];
  return message ? <span className="field-error" id={`${field}-error`}>{message}</span> : null;
}

export function QuoteForm({
  defaultService = "end-of-tenancy-cleaning",
  sourcePath = "/get-a-quote/",
}: {
  defaultService?: ServiceValue;
  sourcePath?: string;
}) {
  const [service, setService] = useState<ServiceValue>(defaultService);
  const [state, setState] = useState<SubmissionState>({ status: "idle" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    setState({ status: "submitting" });

    try {
      const response = await fetch("/api/enquiries/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...payload,
          privacyConsent: formData.get("privacyConsent") === "on",
          sourcePath,
        }),
      });
      const result = (await response.json()) as {
        ok: boolean;
        message?: string;
        reference?: string;
        errors?: FieldErrors;
      };

      if (!response.ok || !result.ok) {
        setState({
          status: "error",
          message: result.message ?? "Please check the form and try again.",
          errors: result.errors,
        });
        return;
      }

      form.reset();
      setService(defaultService);
      setState({
        status: "success",
        message: result.message,
        reference: result.reference,
      });
    } catch {
      setState({
        status: "error",
        message: `We could not send the enquiry. Please try again or email ${siteConfig.email}.`,
      });
    }
  }

  if (state.status === "success") {
    return (
      <div className="form-receipt" role="status" aria-live="polite">
        <span className="receipt-icon"><DecorativeIcon icon={CheckmarkCircle02Icon} size={26} /></span>
        <p className="eyebrow">Enquiry received</p>
        <h2>Thank you — we have your details.</h2>
        <p>{state.message}</p>
        {state.reference ? <p className="receipt-reference">Reference: <strong>{state.reference}</strong></p> : null}
      </div>
    );
  }

  const errors = state.errors;
  const errorEntries = Object.entries(errors ?? {}).filter(([, messages]) => messages?.[0]);

  return (
    <form className="quote-form" action="/api/enquiries/" method="post" onSubmit={handleSubmit} noValidate>
      <div className="form-steps" aria-label="Quote request steps">
        <span><b>1</b> Service</span>
        <span><b>2</b> Property</span>
        <span><b>3</b> Contact</span>
        <span><b>4</b> Review</span>
      </div>

      {state.status === "error" ? (
        <div className="form-error-summary" role="alert" aria-live="assertive">
          <div><DecorativeIcon icon={InformationCircleIcon} size={20} /><strong>We could not submit the form.</strong></div>
          <p>{state.message}</p>
          {errorEntries.length ? (
            <ul>
              {errorEntries.map(([field, messages]) => (
                <li key={field}><a href={`#${field}`}>{messages?.[0]}</a></li>
              ))}
            </ul>
          ) : null}
        </div>
      ) : null}

      <fieldset className="form-section">
        <legend>Choose your service</legend>
        <div className="choice-grid">
          <label className={service === "end-of-tenancy-cleaning" ? "choice-card is-selected" : "choice-card"}>
            <input
              type="radio"
              name="service"
              value="end-of-tenancy-cleaning"
              checked={service === "end-of-tenancy-cleaning"}
              onChange={() => setService("end-of-tenancy-cleaning")}
            />
            <span><strong>End of tenancy cleaning</strong><small>For a rental-property handover or move.</small></span>
          </label>
          <label className={service === "pest-control" ? "choice-card is-selected" : "choice-card"}>
            <input
              type="radio"
              name="service"
              value="pest-control"
              checked={service === "pest-control"}
              onChange={() => setService("pest-control")}
            />
            <span><strong>Pest control</strong><small>Tell us what you have noticed at the property.</small></span>
          </label>
        </div>
        <FieldError field="service" errors={errors} />
      </fieldset>

      <fieldset className="form-section">
        <legend>Property or problem details</legend>
        <div className="form-grid">
          <label className="field" htmlFor="propertyType">
            <span>Property type <em>Required</em></span>
            <select id="propertyType" name="propertyType" required aria-invalid={Boolean(errors?.propertyType)} aria-describedby={errors?.propertyType ? "propertyType-error" : undefined} defaultValue="">
              <option value="" disabled>Choose a property type</option>
              <option value="flat">Flat or apartment</option>
              <option value="house">House</option>
              <option value="shared-accommodation">Shared accommodation</option>
              <option value="commercial">Commercial premises</option>
              <option value="other">Other</option>
            </select>
            <FieldError field="propertyType" errors={errors} />
          </label>

          {service === "end-of-tenancy-cleaning" ? (
            <label className="field" htmlFor="bedrooms">
              <span>Bedrooms <em>Required</em></span>
              <select id="bedrooms" name="bedrooms" required aria-invalid={Boolean(errors?.bedrooms)} aria-describedby={errors?.bedrooms ? "bedrooms-error" : undefined} defaultValue="">
                <option value="" disabled>Choose bedroom count</option>
                <option value="studio">Studio</option>
                <option value="1">1 bedroom</option>
                <option value="2">2 bedrooms</option>
                <option value="3">3 bedrooms</option>
                <option value="4">4 bedrooms</option>
                <option value="5-plus">5+ bedrooms</option>
              </select>
              <FieldError field="bedrooms" errors={errors} />
            </label>
          ) : (
            <label className="field" htmlFor="pestType">
              <span>Pest type <small>Optional if unsure</small></span>
              <input id="pestType" name="pestType" type="text" maxLength={80} placeholder="For example, rat, mouse or unknown" aria-invalid={Boolean(errors?.pestType)} aria-describedby={errors?.pestType ? "pestType-error" : undefined} />
              <FieldError field="pestType" errors={errors} />
            </label>
          )}

          <label className="field" htmlFor="postcode">
            <span>Postcode or area <em>Required</em></span>
            <input id="postcode" name="postcode" type="text" autoComplete="postal-code" maxLength={20} required aria-invalid={Boolean(errors?.postcode)} aria-describedby={errors?.postcode ? "postcode-error" : undefined} />
            <FieldError field="postcode" errors={errors} />
          </label>

          <label className="field" htmlFor="preferredDate">
            <span>Preferred date <small>Optional</small></span>
            <input id="preferredDate" name="preferredDate" type="date" aria-invalid={Boolean(errors?.preferredDate)} aria-describedby={errors?.preferredDate ? "preferredDate-help preferredDate-error" : "preferredDate-help"} />
            <small className="field-help" id="preferredDate-help">A preferred date does not confirm availability.</small>
            <FieldError field="preferredDate" errors={errors} />
          </label>

          {service === "end-of-tenancy-cleaning" ? (
            <div className="field field-wide">
              <span>Furniture status <em>Required</em></span>
              <div
                className="choice-grid choice-grid-furniture"
                role="radiogroup"
                aria-label="Furniture status"
                aria-invalid={Boolean(errors?.furnitureStatus)}
                aria-describedby={errors?.furnitureStatus ? "furnitureStatus-error" : undefined}
              >
                {[
                  ["furnished", "Furnished"],
                  ["unfurnished", "Unfurnished"],
                  ["partly-furnished", "Partly furnished"],
                  ["unknown", "Not sure"],
                ].map(([value, label]) => (
                  <label className="choice-card choice-card-compact" key={value}>
                    <input
                      type="radio"
                      name="furnitureStatus"
                      value={value}
                      required
                    />
                    <span><strong>{label}</strong></span>
                  </label>
                ))}
              </div>
              <FieldError field="furnitureStatus" errors={errors} />
            </div>
          ) : null}
        </div>

        <label className="field" htmlFor="message">
          <span>Access, condition or problem notes <small>Optional</small></span>
          <textarea id="message" name="message" rows={5} maxLength={1500} placeholder="Mention access instructions, property condition, a fixed deadline or what you have noticed." aria-invalid={Boolean(errors?.message)} aria-describedby={errors?.message ? "message-error" : undefined} />
          <FieldError field="message" errors={errors} />
        </label>
      </fieldset>

      <fieldset className="form-section">
        <legend>Your contact details</legend>
        <div className="form-grid">
          <label className="field" htmlFor="fullName">
            <span>Full name <em>Required</em></span>
            <input id="fullName" name="fullName" type="text" autoComplete="name" maxLength={100} required aria-invalid={Boolean(errors?.fullName)} aria-describedby={errors?.fullName ? "fullName-error" : undefined} />
            <FieldError field="fullName" errors={errors} />
          </label>
          <label className="field" htmlFor="email">
            <span>Email address <em>Required</em></span>
            <input id="email" name="email" type="email" autoComplete="email" maxLength={254} required aria-invalid={Boolean(errors?.email)} aria-describedby={errors?.email ? "email-error" : undefined} />
            <FieldError field="email" errors={errors} />
          </label>
          <label className="field field-wide" htmlFor="phone">
            <span>Phone number <small>Optional</small></span>
            <input id="phone" name="phone" type="tel" autoComplete="tel" maxLength={30} aria-invalid={Boolean(errors?.phone)} aria-describedby={errors?.phone ? "phone-error" : undefined} />
            <FieldError field="phone" errors={errors} />
          </label>
        </div>
      </fieldset>

      <div className="website-field" aria-hidden="true" hidden>
        <label htmlFor="website">Website</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="form-review">
        <label className="consent-field" htmlFor="privacyConsent">
          <input id="privacyConsent" name="privacyConsent" type="checkbox" required aria-invalid={Boolean(errors?.privacyConsent)} aria-describedby={errors?.privacyConsent ? "privacyConsent-help privacyConsent-error" : "privacyConsent-help"} />
          <span id="privacyConsent-help">I agree that Best One Services may use these details to review and respond to this enquiry. <strong>No account will be created.</strong></span>
        </label>
        <FieldError field="privacyConsent" errors={errors} />
        <p className="privacy-note">Your details are collected only for this enquiry workflow. Do not include payment information or sensitive personal data.</p>
        <button className="button form-submit" type="submit" disabled={state.status === "submitting"}>
          {state.status === "submitting" ? "Sending your enquiry…" : "Get a Free Quote"}
        </button>
      </div>
    </form>
  );
}
