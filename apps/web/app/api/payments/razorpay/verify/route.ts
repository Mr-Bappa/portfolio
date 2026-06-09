import { NextRequest, NextResponse } from "next/server";
import { createHmac }               from "crypto";
import { supabaseAdmin }            from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    taskId,
  } = await req.json();

  // Verify HMAC signature
  const body      = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expected  = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    return NextResponse.json({ success: false, error: "Invalid signature" }, { status: 400 });
  }

  // Update payment + task in Supabase
  const db = supabaseAdmin();
  await db
    .from("payments")
    .update({
      provider_payment_id: razorpay_payment_id,
      status:              "captured",
      captured_at:         new Date().toISOString(),
    })
    .eq("provider_order_id", razorpay_order_id);

  await db
    .from("tasks")
    .update({ status: "paid" })
    .eq("id", taskId);

  return NextResponse.json({ success: true });
}
