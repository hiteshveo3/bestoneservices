"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/button-link";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(!localStorage.getItem("bos-cookie-choice")));
    return () => cancelAnimationFrame(frame);
  }, []);
  if (!visible) return null;
  const choose = (value: "accepted" | "rejected") => { localStorage.setItem("bos-cookie-choice", value); setVisible(false); };
  return <aside className="cookie-consent" aria-label="Cookie choices"><strong>Cookie choices</strong><p>Essential cookies keep this site working. Analytics and marketing cookies stay off unless you accept them.</p><div><Button variant="secondary" size="sm" onClick={() => choose("rejected")}>Reject optional</Button><Button variant="dark" size="sm" onClick={() => choose("accepted")}>Accept optional</Button></div></aside>;
}
