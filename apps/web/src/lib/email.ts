export async function sendBookingAcknowledgement(input: { email: string; reference: string }) {
  if (!process.env.EMAIL_PROVIDER || !process.env.EMAIL_API_KEY) return { mode: "disabled" as const };
  // Provider integration remains intentionally disabled until owner supplies approved credentials.
  console.info("Transactional email adapter configured", { reference: input.reference });
  return { mode: "provider-pending" as const };
}
