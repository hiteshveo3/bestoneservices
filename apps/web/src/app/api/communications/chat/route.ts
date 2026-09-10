import { NextResponse } from "next/server";
import { z } from "zod";
import { getFirebaseDb } from "@/lib/firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { actorOwnsResource, requireAuthenticated } from "@/lib/roles";

const ChatSendSchema = z.object({
  bookingId: z.string().min(1, "Booking ID is required"),
  bookingReference: z.string().min(1, "Booking reference is required"),
  text: z.string().trim().min(1, "Message text is required").max(4000),
  senderRole: z.enum(["customer", "admin", "system"]).optional(),
  senderName: z.string().optional(),
});

export async function GET(req: Request) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const { searchParams } = new URL(req.url);
  const bookingId = searchParams.get("bookingId");

  if (!bookingId) {
    return NextResponse.json({ error: "bookingId query parameter required" }, { status: 400 });
  }

  const actor = await requireAuthenticated(req);
  if (!actor) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const bookingSnap = await db.collection("bookings").doc(bookingId).get();
    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    if (!actorOwnsResource(actor, bookingSnap.data())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const convRef = db.collection("conversations").doc(bookingId);
    const convSnap = await convRef.get();

    if (!convSnap.exists) {
      return NextResponse.json({ conversation: null, messages: [] });
    }

    const messagesSnap = await convRef.collection("messages").orderBy("createdAt", "asc").get();
    const messages = messagesSnap.docs.map((d) => ({ id: d.id, ...d.data() }));

    return NextResponse.json({
      conversation: { id: convSnap.id, ...convSnap.data() },
      messages,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to fetch chat messages";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  let db;
  try {
    db = getFirebaseDb();
  } catch {
    return NextResponse.json({ error: "Firebase Admin DB unavailable" }, { status: 500 });
  }

  const actor = await requireAuthenticated(req);
  if (!actor) {
    return NextResponse.json({ error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = ChatSendSchema.parse(body);

    const bookingSnap = await db.collection("bookings").doc(parsed.bookingId).get();
    if (!bookingSnap.exists) {
      return NextResponse.json({ error: "Booking not found" }, { status: 404 });
    }
    const bookingData = bookingSnap.data();
    if (!actorOwnsResource(actor, bookingData)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (bookingData?.reference !== parsed.bookingReference) {
      return NextResponse.json({ error: "Booking reference mismatch" }, { status: 400 });
    }

    const senderRole = actor.role === "admin" ? "admin" : "customer";
    const senderName = senderRole === "admin"
      ? "Best One Support"
      : (bookingData?.customerSnapshot?.fullName || parsed.senderName || "Customer");
    const serverNow = FieldValue.serverTimestamp();
    const convId = parsed.bookingId;

    const convRef = db.collection("conversations").doc(convId);
    const convSnap = await convRef.get();

    const customerName = bookingData?.customerSnapshot?.fullName || "Customer";
    const customerEmail = bookingData?.customerSnapshot?.email || actor.email || "";
    const customerId = bookingData?.customerId || actor.uid;

    if (!convSnap.exists) {
      await convRef.set({
        id: convId,
        bookingId: parsed.bookingId,
        bookingReference: parsed.bookingReference,
        customerId,
        customerName,
        customerEmail,
        lastMessageText: parsed.text.trim(),
        lastMessageSender: senderRole,
        unreadAdminCount: senderRole === "customer" ? 1 : 0,
        unreadCustomerCount: senderRole === "admin" ? 1 : 0,
        createdAt: serverNow,
        updatedAt: serverNow,
      });
    } else {
      const prevData = convSnap.data() || {};
      await convRef.update({
        lastMessageText: parsed.text.trim(),
        lastMessageSender: senderRole,
        ...(senderRole === "customer" ? { unreadAdminCount: (prevData.unreadAdminCount || 0) + 1 } : {}),
        ...(senderRole === "admin" ? { unreadCustomerCount: (prevData.unreadCustomerCount || 0) + 1 } : {}),
        updatedAt: serverNow,
      });
    }

    // Add message to subcollection
    const msgRef = convRef.collection("messages").doc();
    const msgData = {
      id: msgRef.id,
      conversationId: convId,
      senderId: actor.uid,
      senderName,
      senderRole,
      text: parsed.text.trim(),
      read: false,
      createdAt: serverNow,
    };

    await msgRef.set(msgData);

    return NextResponse.json({
      success: true,
      message: msgData,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return NextResponse.json({ error: "Validation failed", details: err.issues }, { status: 400 });
    }
    const message = err instanceof Error ? err.message : "Chat message submission failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
