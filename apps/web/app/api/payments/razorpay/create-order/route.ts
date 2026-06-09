import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import { authOptions } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.profileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Razorpay environment variables are missing" },
      { status: 500 }
    );
  }

  const rzp = new Razorpay({
    key_id: keyId,
    key_secret: keySecret,
  });

  const { taskId, amount, currency } = await req.json();

  const order = await rzp.orders.create({
    amount,
    currency,
    receipt: `task_${taskId.slice(0, 8)}`,
    notes: { task_id: taskId },
  });

  const db = supabaseAdmin();

  const { error } = await db.from("payments").insert({
    task_id: taskId,
    client_id: session.user.profileId,
    provider: "razorpay",
    provider_order_id: order.id,
    amount,
    currency,
    status: "created",
  });

  if (error) {
    return NextResponse.json(
      { error: "Failed to save payment record" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    orderId: order.id,
    keyId,
  });
}