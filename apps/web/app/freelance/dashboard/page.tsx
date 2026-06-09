"use client";

import { useEffect, useState } from "react";
import { useSession }          from "next-auth/react";
import { useRouter }           from "next/navigation";
import Link                    from "next/link";
import { Navbar }              from "@/components/ui/Navbar";
import { Footer }              from "@/components/ui/Footer";
import { cn }                  from "@/lib/utils";

type Task = {
  id:           string;
  title:        string;
  service_id:   string;
  status:       string;
  currency:     string;
  budget_inr:   number | null;
  budget_usd:   number | null;
  delivery_days: number;
  created_at:   string;
};

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  pending:     { label: "Pending payment", color: "text-amber border-amber-dark/50 bg-amber-dark/20"  },
  paid:        { label: "Paid",            color: "text-teal-light border-teal/30 bg-teal-dark/20"   },
  in_progress: { label: "In progress",    color: "text-violet-light border-violet/30 bg-violet-dark/20" },
  review:      { label: "In review",      color: "text-amber border-amber-dark/50 bg-amber-dark/20"  },
  completed:   { label: "Completed",      color: "text-teal-light border-teal/30 bg-teal-dark/20"   },
  cancelled:   { label: "Cancelled",      color: "text-dim border-border bg-void"                   },
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks,   setTasks]   = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/auth/signin");
  }, [status, router]);

  useEffect(() => {
    if (status !== "authenticated") return;
    fetch("/api/tasks")
      .then((r) => r.json())
      .then((d) => setTasks(d.tasks ?? []))
      .finally(() => setLoading(false));
  }, [status]);

  if (status === "loading" || loading) return <Loader />;

  const stats = {
    total:       tasks.length,
    active:      tasks.filter((t) => ["paid", "in_progress", "review"].includes(t.status)).length,
    completed:   tasks.filter((t) => t.status === "completed").length,
  };

  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-28 pb-20 max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-medium text-white/90">
              Welcome back, {session?.user?.name?.split(" ")[0]}
            </h1>
            <p className="text-dim text-sm mt-1 font-mono">{session?.user?.email}</p>
          </div>
          <Link
            href="/freelance/create-task"
            className="bg-teal text-white text-sm px-5 py-2.5 rounded-lg
                       hover:bg-teal-dark transition-all"
          >
            + New task
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: "Total tasks",  value: stats.total     },
            { label: "Active",       value: stats.active    },
            { label: "Completed",    value: stats.completed },
          ].map((s) => (
            <div key={s.label} className="glass rounded-xl p-5 text-center">
              <p className="text-teal-light font-mono text-2xl font-medium">{s.value}</p>
              <p className="text-dim text-xs mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tasks list */}
        <div>
          <h2 className="text-white/80 text-sm font-medium mb-4 font-mono uppercase tracking-wider">
            Your tasks
          </h2>

          {tasks.length === 0 ? (
            <div className="glass rounded-xl p-12 text-center">
              <p className="text-muted text-sm mb-4">No tasks yet</p>
              <Link
                href="/freelance/create-task"
                className="border border-teal/30 text-teal-light text-sm px-5 py-2.5
                           rounded-lg hover:bg-teal/10 transition-all"
              >
                Create your first task →
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {tasks.map((task) => {
                const cfg    = STATUS_CONFIG[task.status] ?? STATUS_CONFIG.pending;
                const amount = task.currency === "INR"
                  ? task.budget_inr ? `₹${task.budget_inr.toLocaleString("en-IN")}` : "—"
                  : task.budget_usd ? `$${task.budget_usd}` : "—";

                return (
                  <div key={task.id}
                       className="glass rounded-xl p-5 flex items-center justify-between gap-4
                                  hover:border-teal/20 transition-all">
                    <div className="flex-1 min-w-0">
                      <p className="text-white/90 text-sm font-medium truncate">{task.title}</p>
                      <p className="text-dim text-xs mt-0.5 font-mono">{task.service_id}</p>
                    </div>
                    <div className="flex items-center gap-4 flex-shrink-0">
                      <p className="text-teal-light font-mono text-sm">{amount}</p>
                      <span className={cn(
                        "text-[10px] font-mono px-2.5 py-0.5 rounded-full border",
                        cfg.color
                      )}>
                        {cfg.label}
                      </span>
                      <p className="text-faint text-xs hidden md:block">
                        {new Date(task.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  );
}

function Loader() {
  return (
    <main className="min-h-screen bg-void flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
    </main>
  );
}
