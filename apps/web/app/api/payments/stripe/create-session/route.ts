import { NextRequest, NextResponse } from "next/server";
import { getServerSession }          from "next-auth";
import { authOptions }               from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin }             from "@/lib/supabase";
import Stripe                        from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.profileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { taskId, priceUSD, title } = await req.json();
  const baseUrl = process.env.NEXTAUTH_URL ?? "http://localhost:3000";

  const checkout = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode:                 "payment",
    line_items: [
      {
        price_data: {
          currency:     "usd",
          product_data: { name: title, description: "Bappaditya Maity — Analytics Engineer" },
          unit_amount:  priceUSD * 100,
        },
        quantity: 1,
      },
    ],
    metadata:   { task_id: taskId, client_id: session.user.profileId },
    success_url:`${baseUrl}/freelance/success?task=${taskId}&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${baseUrl}/freelance/create-task`,
  });

  // Save payment record
  const db = supabaseAdmin();
  await db.from("payments").insert({
    task_id:           taskId,
    client_id:         session.user.profileId,
    provider:          "stripe",
    provider_order_id: checkout.id,
    amount:            priceUSD * 100,
    currency:          "USD",
    status:            "created",
  });

  return NextResponse.json({ url: checkout.url });
}
