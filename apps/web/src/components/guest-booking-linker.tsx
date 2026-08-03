"use client";

import { useState } from "react";

export function GuestBookingLinker() {
  const [reference, setReference] = useState(""); const [state, setState] = useState<"idle" | "sending" | "success" | "error">("idle"); const [message, setMessage] = useState("");
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault(); setState("sending"); setMessage("");
    const response = await fetch("/api/account/link-booking", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ reference }) }); const body = await response.json().catch(() => ({}));
    if (!response.ok) { setState("error"); setMessage(body.error === "BOOKING_NOT_FOUND" ? "We could not find a booking with that reference for this account." : "That booking cannot be added right now. Please check the reference and try again."); return; }
    setState("success"); setMessage("Booking added. Your bookings list is now up to date.");
  }
  return <form className="app-form" onSubmit={submit}><label className="field"><span>Booking reference</span><input value={reference} onChange={(event) => setReference(event.target.value.toUpperCase())} placeholder="BOS-2026-XXXXXXXX" autoCapitalize="characters" required /></label><p className="field-help">Use the reference from your booking confirmation email. It will only be added when the booking email matches this signed-in account.</p>{state !== "idle" ? <p className={state === "success" ? "app-notice success" : "app-notice error"} role={state === "error" ? "alert" : "status"}>{message}</p> : null}<button className="button" disabled={state === "sending"}>{state === "sending" ? "Adding booking…" : "Add booking"}</button></form>;
}
