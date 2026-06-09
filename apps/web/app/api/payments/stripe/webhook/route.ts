import { NextRequest, NextResponse } from "next/server";
import Stripe                        from "stripe";
import { supabaseAdmin }            from "@/lib/supabase";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-06-20" });

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig  = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const checkout = event.data.object as Stripe.Checkout.Session;
    const taskId   = checkout.metadata?.task_id;
    if (!taskId) return NextResponse.json({ ok: true });

    const db = supabaseAdmin();
    await db
      .from("payments")
      .update({ status: "captured", provider_payment_id: checkout.payment_intent as string,
                captured_at: new Date().toISOString() })
      .eq("provider_order_id", checkout.id);

    await db
      .from("tasks")
      .update({ status: "paid" })
      .eq("id", taskId);
  }

  return NextResponse.json({ ok: true });
}
