import Link from "next/link";
import { SERVICES, PROFILE } from "@/lib/constants";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { formatCurrency } from "@/lib/utils";

export default function FreelancePage() {
  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-28 pb-20 max-w-5xl mx-auto px-6">

        {/* Header */}
        <div className="text-center mb-16">
          <span className="inline-block font-mono text-[10px] tracking-widest text-dim
                           uppercase border border-border px-3 py-1 rounded-full mb-4">
            Freelance marketplace
          </span>
          <h1 className="text-3xl md:text-4xl font-medium text-white/90 mb-4">
            Hire me for your next project
          </h1>
          <p className="text-muted text-base max-w-xl mx-auto leading-relaxed">
            Production-grade data engineering & AI systems. National & international clients.
            Pay securely via Razorpay or Stripe.
          </p>
        </div>

        {/* How it works */}
        <div className="glass rounded-2xl p-6 mb-12">
          <p className="text-dim font-mono text-xs tracking-widest uppercase mb-5 text-center">
            How it works
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { step: "01", title: "Create account",  desc: "Sign in with Google or GitHub — takes 30 seconds." },
              { step: "02", title: "Define your task", desc: "Pick a service, describe your requirements, set scope." },
              { step: "03", title: "Pay securely",     desc: "Pay via Razorpay (UPI/cards) or Stripe (international)." },
              { step: "04", title: "Track & receive",  desc: "Follow progress in your dashboard, receive deliverables." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-8 h-8 rounded-full bg-teal-dark/30 border border-teal/30
                                text-teal-light font-mono text-xs flex items-center justify-center
                                mx-auto mb-3">
                  {s.step}
                </div>
                <p className="text-white/80 text-sm font-medium mb-1">{s.title}</p>
                <p className="text-dim text-xs leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
          {SERVICES.map((s) => (
            <div key={s.id} className="glass rounded-xl p-6 flex flex-col gap-4
                                        hover:border-teal/30 transition-all group">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`inline-block text-[10px] font-mono px-2.5 py-0.5
                                    rounded-full border mb-3
                                    ${s.badgeType === "open"
                                      ? "bg-teal-dark/30 border-teal/30 text-teal-light"
                                      : "bg-amber-dark/30 border-amber-dark/30 text-amber"}`}>
                    {s.badge}
                  </span>
                  <h3 className="text-white/90 text-base font-medium">{s.title}</h3>
                  <p className="text-dim text-sm mt-1">{s.desc}</p>
                </div>
              </div>

              <div className="flex-1" />

              <div className="flex items-end justify-between">
                <div>
                  <p className="text-teal-light font-mono text-xl font-medium">
                    {formatCurrency(s.priceINR, "INR")}
                  </p>
                  <p className="text-dim font-mono text-xs">
                    / {formatCurrency(s.priceUSD, "USD")} · {s.deliveryDays}d delivery
                  </p>
                </div>
                <Link
                  href={`/freelance/create-task?service=${s.id}`}
                  className="bg-teal text-white text-sm px-5 py-2.5 rounded-lg
                             hover:bg-teal-dark transition-all group-hover:scale-105"
                >
                  Get started →
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Custom project CTA */}
        <div className="glass rounded-2xl p-8 text-center border-teal/20">
          <p className="text-teal-light font-mono text-xs tracking-widest uppercase mb-3">
            Custom project
          </p>
          <h2 className="text-xl font-medium text-white/90 mb-3">
            Need something specific?
          </h2>
          <p className="text-muted text-sm mb-6 max-w-md mx-auto">
            ETL architecture design, AI system consulting, data strategy —
            let's scope it together before you pay anything.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/freelance/create-task?service=custom"
              className="bg-teal text-white px-6 py-3 rounded-lg text-sm
                         hover:bg-teal-dark transition-all"
            >
              Describe your project
            </Link>
            <a
              href={`mailto:${PROFILE.email}`}
              className="border border-border text-muted px-6 py-3 rounded-lg text-sm
                         hover:border-teal/30 hover:text-teal-light transition-all"
            >
              Email directly
            </a>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
