"use client";

import Link from "next/link";
import { SERVICES } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function FreelanceSection() {
  return (
    <section id="freelance" className="py-20 bg-void">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-dim font-mono text-xs text-center tracking-widest uppercase mb-2">
          Work with me
        </p>
        <h2 className="text-2xl font-medium text-center text-white/90 mb-3">
          Freelance marketplace
        </h2>
        <p className="text-muted text-sm text-center mb-12 max-w-xl mx-auto">
          Create an account, define your task, pay securely — I deliver production-grade work.
          National & international clients welcome.
        </p>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {SERVICES.map((s) => (
            <div key={s.id} className="glass p-5 rounded-xl flex flex-col gap-3 hover:border-teal/30 transition-all">
              {/* Badge */}
              <span className={cn(
                "self-start text-[10px] font-mono px-2.5 py-0.5 rounded-full border",
                s.badgeType === "open"
                  ? "bg-teal-dark/30 border-teal/30 text-teal-light"
                  : "bg-amber-dark/30 border-amber-dark/30 text-amber"
              )}>
                {s.badge}
              </span>

              <div>
                <h3 className="text-white/90 text-sm font-medium mb-1">{s.title}</h3>
                <p className="text-dim text-xs">{s.desc}</p>
              </div>

              <div className="mt-auto">
                <p className="text-teal-light font-mono text-base font-medium">
                  {formatCurrency(s.priceINR, "INR")}
                </p>
                <p className="text-dim font-mono text-xs">
                  / {formatCurrency(s.priceUSD, "USD")} · {s.deliveryDays}d delivery
                </p>
              </div>

              <Link
                href={`/freelance/create-task?service=${s.id}`}
                className="mt-2 w-full text-center border border-teal/30 text-teal-light
                           text-xs font-mono py-2 rounded-lg hover:bg-teal/10 transition-all"
              >
                Create a task →
              </Link>
            </div>
          ))}
        </div>

        {/* Bottom CTA row */}
        <div className="glass rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-white/90 text-sm font-medium mb-1">
              Have a custom project in mind?
            </p>
            <p className="text-muted text-xs">
              ETL architecture · AI system design · data strategy — let's scope it together.
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <Link
              href="/freelance/register"
              className="bg-teal text-white text-sm px-5 py-2.5 rounded-lg
                         hover:bg-teal-dark transition-all font-medium"
            >
              Create account
            </Link>
            <Link
              href="/freelance"
              className="border border-border text-muted text-sm px-5 py-2.5 rounded-lg
                         hover:border-teal/30 hover:text-teal-light transition-all"
            >
              Browse services
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
