import { NextRequest, NextResponse } from "next/server";
import { getServerSession }          from "next-auth";
import { authOptions }               from "@/app/api/auth/[...nextauth]/route";
import { supabaseAdmin }             from "@/lib/supabase";
import { SERVICES }                  from "@/lib/constants";

// GET /api/tasks — fetch tasks for the logged-in client
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.profileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const db = supabaseAdmin();
  const { data: tasks, error } = await db
    .from("tasks")
    .select("*")
    .eq("client_id", session.user.profileId)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ tasks });
}

// POST /api/tasks — create a new task
export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.profileId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { service_id, title, description, requirements, currency } = body;

  if (!service_id || !title || !description) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const service = SERVICES.find((s) => s.id === service_id);
  const db      = supabaseAdmin();

  const { data, error } = await db
    .from("tasks")
    .insert({
      client_id:     session.user.profileId,
      service_id,
      title,
      description,
      requirements:  requirements ?? null,
      currency,
      budget_inr:    service?.priceINR ?? null,
      budget_usd:    service?.priceUSD ?? null,
      delivery_days: service?.deliveryDays ?? 7,
      status:        "pending",
    })
    .select("id")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ taskId: data.id });
}
