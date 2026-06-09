import { NextRequest, NextResponse } from "next/server";
import { getServerSession }          from "next-auth";
import { authOptions }               from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin }             from "@/lib/supabase";
import Razorpay                      from "razorpay";

const rzp = new Razorpay({
  key_id:     process.env.RAZORPAY_KEY_ID!,
  key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.profileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId, amount, currency } = await req.json();

  // Create Razorpay order
  const order = await rzp.orders.create({
    amount,        // in paise
    currency,
    receipt: `task_${taskId.slice(0, 8)}`,
    notes: { task_id: taskId },
  });

  // Save payment record
  const db = supabaseAdmin();
  await db.from("payments").insert({
    task_id:           taskId,
    client_id:         session.user.profileId,
    provider:          "razorpay",
    provider_order_id: order.id,
    amount,
    currency,
    status:            "created",
  });

  return NextResponse.json({
    orderId: order.id,
    keyId:   process.env.RAZORPAY_KEY_ID,
  });
}
