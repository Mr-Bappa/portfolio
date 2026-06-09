"use client";

import { useState, useEffect } from "react";
import { useSession }           from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm }              from "react-hook-form";
import { zodResolver }          from "@hookform/resolvers/zod";
import { z }                    from "zod";
import { toast }                from "sonner";
import { Navbar }               from "@/components/ui/Navbar";
import { SERVICES }             from "@/lib/constants";
import { formatCurrency, cn }   from "@/lib/utils";
import { PaymentModal }         from "@/components/payment/PaymentModal";

const schema = z.object({
  service_id:   z.string().min(1, "Pick a service"),
  title:        z.string().min(5, "Title must be at least 5 characters"),
  description:  z.string().min(30, "Please describe your project in detail (30+ chars)"),
  requirements: z.string().optional(),
  currency:     z.enum(["INR", "USD"]),
});

type FormData = z.infer<typeof schema>;

const STEPS = ["Service", "Details", "Review & Pay"];

export default function CreateTaskPage() {
  const { data: session, status } = useSession();
  const router      = useRouter();
  const params      = useSearchParams();
  const preService  = params.get("service") ?? "";

  const [step,         setStep]         = useState(0);
  const [showPayment,  setShowPayment]  = useState(false);
  const [taskId,       setTaskId]       = useState<string | null>(null);
  const [submitting,   setSubmitting]   = useState(false);

  const { register, handleSubmit, watch, setValue, formState: { errors } } =
    useForm<FormData>({
      resolver: zodResolver(schema),
      defaultValues: { service_id: preService, currency: "INR" },
    });

  const watchService  = watch("service_id");
  const watchCurrency = watch("currency");
  const selectedSvc   = SERVICES.find((s) => s.id === watchService);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/auth/signin?callbackUrl=/freelance/create-task?service=${preService}`);
    }
  }, [status, router, preService]);

  if (status === "loading") return <Loader />;

  // Step 1 — Service selection
  const ServiceStep = () => (
    <div className="flex flex-col gap-4">
      <h2 className="text-white/90 text-lg font-medium mb-2">Choose a service</h2>
      {SERVICES.map((s) => (
        <label
          key={s.id}
          className={cn(
            "flex items-center justify-between gap-4 glass p-4 rounded-xl cursor-pointer transition-all",
            watchService === s.id ? "border-teal/50 bg-teal/5" : "hover:border-border"
          )}
        >
          <input
            type="radio"
            value={s.id}
            {...register("service_id")}
            className="hidden"
          />
          <div>
            <p className="text-white/90 text-sm font-medium">{s.title}</p>
            <p className="text-dim text-xs mt-0.5">{s.desc} · {s.deliveryDays}d delivery</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-teal-light font-mono text-sm">
              {watchCurrency === "INR"
                ? formatCurrency(s.priceINR, "INR")
                : formatCurrency(s.priceUSD, "USD")}
            </p>
          </div>
        </label>
      ))}
      {/* Custom option */}
      <label
        className={cn(
          "flex items-center gap-4 glass p-4 rounded-xl cursor-pointer transition-all",
          watchService === "custom" ? "border-teal/50 bg-teal/5" : "hover:border-border"
        )}
      >
        <input type="radio" value="custom" {...register("service_id")} className="hidden" />
        <div>
          <p className="text-white/90 text-sm font-medium">Custom project</p>
          <p className="text-dim text-xs mt-0.5">Describe your needs — I'll scope & quote</p>
        </div>
        <p className="text-muted font-mono text-sm ml-auto">Request quote</p>
      </label>
      {errors.service_id && <p className="text-red-400 text-xs">{errors.service_id.message}</p>}

      {/* Currency toggle */}
      <div className="flex items-center gap-3 mt-2">
        <span className="text-dim text-xs font-mono">Currency:</span>
        {(["INR", "USD"] as const).map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setValue("currency", c)}
            className={cn(
              "text-xs font-mono px-3 py-1 rounded-full border transition-all",
              watchCurrency === c
                ? "bg-teal/10 border-teal/40 text-teal-light"
                : "border-border text-dim hover:border-teal/20"
            )}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );

  // Step 2 — Details
  const DetailsStep = () => (
    <div className="flex flex-col gap-5">
      <h2 className="text-white/90 text-lg font-medium mb-2">Project details</h2>

      <div>
        <label className="text-dim text-xs font-mono mb-2 block">Project title *</label>
        <input
          {...register("title")}
          placeholder="e.g. Build ETL pipeline for e-commerce data"
          className="w-full bg-void border border-border rounded-xl px-4 py-3 text-sm
                     text-white/90 placeholder:text-dim outline-none focus:border-teal/40 transition-colors"
        />
        {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title.message}</p>}
      </div>

      <div>
        <label className="text-dim text-xs font-mono mb-2 block">Description *</label>
        <textarea
          {...register("description")}
          rows={4}
          placeholder="Describe your data sources, expected outputs, tech stack preferences, volume…"
          className="w-full bg-void border border-border rounded-xl px-4 py-3 text-sm
                     text-white/90 placeholder:text-dim outline-none focus:border-teal/40
                     transition-colors resize-none"
        />
        {errors.description && (
          <p className="text-red-400 text-xs mt-1">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="text-dim text-xs font-mono mb-2 block">
          Additional requirements{" "}
          <span className="text-faint">(optional)</span>
        </label>
        <textarea
          {...register("requirements")}
          rows={2}
          placeholder="Specific tools, deadlines, data formats, compliance needs…"
          className="w-full bg-void border border-border rounded-xl px-4 py-3 text-sm
                     text-white/90 placeholder:text-dim outline-none focus:border-teal/40
                     transition-colors resize-none"
        />
      </div>
    </div>
  );

  // Step 3 — Review
  const ReviewStep = () => (
    <div className="flex flex-col gap-5">
      <h2 className="text-white/90 text-lg font-medium mb-2">Review & pay</h2>

      <div className="glass rounded-xl p-5 flex flex-col gap-3">
        <div className="flex justify-between text-sm">
          <span className="text-dim">Service</span>
          <span className="text-white/80">{selectedSvc?.title ?? "Custom"}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dim">Delivery</span>
          <span className="text-white/80">{selectedSvc?.deliveryDays ?? "TBD"} days</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dim">Client</span>
          <span className="text-white/80">{session?.user?.email}</span>
        </div>
        <div className="h-px bg-border" />
        <div className="flex justify-between items-end">
          <span className="text-dim text-sm">Total</span>
          <span className="text-teal-light font-mono text-xl font-medium">
            {selectedSvc
              ? watchCurrency === "INR"
                ? formatCurrency(selectedSvc.priceINR, "INR")
                : formatCurrency(selectedSvc.priceUSD, "USD")
              : "To be quoted"}
          </span>
        </div>
      </div>

      {/* Payment methods info */}
      <div className="flex gap-3">
        <div className="flex-1 glass rounded-xl p-4 text-center">
          <p className="text-dim font-mono text-xs mb-1">India</p>
          <p className="text-white/80 text-sm font-medium">Razorpay</p>
          <p className="text-faint text-xs">UPI · Cards · NetBanking</p>
        </div>
        <div className="flex-1 glass rounded-xl p-4 text-center">
          <p className="text-dim font-mono text-xs mb-1">International</p>
          <p className="text-white/80 text-sm font-medium">Stripe</p>
          <p className="text-faint text-xs">Visa · Mastercard · AMEX</p>
        </div>
      </div>
    </div>
  );

  const STEP_CONTENT = [<ServiceStep key="s"/>, <DetailsStep key="d"/>, <ReviewStep key="r"/>];

  const onSubmit = async (data: FormData) => {
    if (step < 2) { setStep((s) => s + 1); return; }

    // Final submit — create task in DB then open payment
    setSubmitting(true);
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setTaskId(json.taskId);
      setShowPayment(true);
    } catch (e: any) {
      toast.error(e.message ?? "Failed to create task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-28 pb-20 max-w-xl mx-auto px-6">

        {/* Step indicator */}
        <div className="flex items-center gap-2 mb-10">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={cn(
                "w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono border transition-all",
                i < step  ? "bg-teal border-teal text-white" :
                i === step ? "bg-teal/10 border-teal/50 text-teal-light" :
                             "bg-void border-border text-dim"
              )}>
                {i < step ? "✓" : i + 1}
              </div>
              <span className={cn(
                "text-xs font-mono hidden sm:block",
                i === step ? "text-teal-light" : "text-dim"
              )}>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <div className={cn(
                  "flex-1 h-px transition-all",
                  i < step ? "bg-teal/50" : "bg-border"
                )} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
          {STEP_CONTENT[step]}

          <div className="flex gap-3 mt-4">
            {step > 0 && (
              <button
                type="button"
                onClick={() => setStep((s) => s - 1)}
                className="flex-1 border border-border text-muted py-3 rounded-xl
                           hover:border-teal/30 hover:text-teal-light transition-all text-sm"
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-teal text-white py-3 rounded-xl hover:bg-teal-dark
                         transition-all text-sm font-medium disabled:opacity-50"
            >
              {submitting
                ? "Creating task…"
                : step < 2 ? "Continue →"
                : selectedSvc ? "Proceed to payment →"
                : "Submit for quote →"}
            </button>
          </div>
        </form>
      </div>

      {/* Payment modal */}
      {showPayment && taskId && selectedSvc && (
        <PaymentModal
          taskId={taskId}
          service={selectedSvc}
          currency={watchCurrency}
          onClose={() => setShowPayment(false)}
          onSuccess={() => {
            toast.success("Payment successful! Task created.");
            router.push("/freelance/dashboard");
          }}
        />
      )}
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
