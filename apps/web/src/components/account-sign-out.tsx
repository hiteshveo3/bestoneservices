"use client";
import { signOut } from "firebase/auth";
import { getFirebaseClientAuth } from "@/lib/firebase-client";
export function AccountSignOut() { return <button className="account-signout" onClick={async () => { const auth = getFirebaseClientAuth(); if (auth) await signOut(auth); await fetch("/api/auth/logout", { method: "POST" }); window.location.assign("/"); }}>Sign out</button>; }
