"use client";

import { useState } from "react";
import { toast }    from "sonner";
import { cn }       from "@/lib/utils";
import { formatCurrency } from "@/lib/utils";

type Service = {
  id: string; title: string; priceINR: number; priceUSD: number;
};

type Props = {
  taskId:    string;
  service:   Service;
  currency:  "INR" | "USD";
  onClose:   () => void;
  onSuccess: () => void;
};

type Provider = "razorpay" | "stripe";

declare global {
  interface Window { Razorpay: any; }
}

export function PaymentModal({ taskId, service, currency, onClose, onSuccess }: Props) {
  const [provider,   setProvider]   = useState<Provider>(currency === "INR" ? "razorpay" : "stripe");
  const [processing, setProcessing] = useState(false);

  const amount = currency === "INR" ? service.priceINR : service.priceUSD;
  const label  = formatCurrency(amount, currency);

  const payWithRazorpay = async () => {
    setProcessing(true);
    try {
      // 1. Create Razorpay order
      const orderRes = await fetch("/api/payments/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, amount: service.priceINR * 100, currency: "INR" }),
      });
      const { orderId, keyId } = await orderRes.json();

      // 2. Open Razorpay checkout
      const rzp = new window.Razorpay({
        key:         keyId,
        amount:      service.priceINR * 100,
        currency:    "INR",
        name:        "Bappaditya Maity",
        description: service.title,
        order_id:    orderId,
        handler: async (response: any) => {
          // 3. Verify on server
          const verifyRes = await fetch("/api/payments/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...response, taskId }),
          });
          const data = await verifyRes.json();
          if (data.success) {
            onSuccess();
          } else {
            toast.error("Payment verification failed");
          }
        },
        theme: { color: "#1d9e75" },
        modal: { ondismiss: () => setProcessing(false) },
      });
      rzp.open();
    } catch (e) {
      toast.error("Failed to initiate payment");
      setProcessing(false);
    }
  };

  const payWithStripe = async () => {
    setProcessing(true);
    try {
      const res = await fetch("/api/payments/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taskId, priceUSD: service.priceUSD, title: service.title }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      toast.error("Failed to start Stripe checkout");
      setProcessing(false);
    }
  };

  const handlePay = () => {
    if (provider === "razorpay") payWithRazorpay();
    else payWithStripe();
  };

  return (
    // Faux modal overlay (no position:fixed)
    <div style={{ minHeight: "400px", background: "rgba(5,13,26,0.85)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  position: "fixed", inset: 0, zIndex: 50, padding: "1rem" }}>

      {/* Load Razorpay script */}
      <script src="https://checkout.razorpay.com/v1/checkout.js" async />

      <div className="glass rounded-2xl p-8 w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white/90 text-lg font-medium">Complete payment</h2>
          <button onClick={onClose} className="text-dim hover:text-white transition-colors text-xl">
            ×
          </button>
        </div>

        {/* Order summary */}
        <div className="bg-void rounded-xl p-4 mb-6 flex justify-between items-center">
          <div>
            <p className="text-white/80 text-sm font-medium">{service.title}</p>
            <p className="text-dim text-xs mt-0.5">Task ID: {taskId.slice(0, 8)}…</p>
          </div>
          <p className="text-teal-light font-mono text-xl font-medium">{label}</p>
        </div>

        {/* Provider selector */}
        <p className="text-dim text-xs font-mono mb-3 uppercase tracking-widest">
          Payment method
        </p>
        <div className="grid grid-cols-2 gap-3 mb-6">
          {([
            { id: "razorpay", label: "Razorpay", sub: "UPI · Cards · NetBanking", flag: "🇮🇳" },
            { id: "stripe",   label: "Stripe",   sub: "Visa · Mastercard · AMEX", flag: "🌐" },
          ] as const).map((p) => (
            <button
              key={p.id}
              onClick={() => setProvider(p.id)}
              className={cn(
                "flex flex-col items-center gap-1 p-4 rounded-xl border transition-all text-center",
                provider === p.id
                  ? "border-teal/50 bg-teal/5 text-teal-light"
                  : "border-border text-dim hover:border-teal/20"
              )}
            >
              <span className="text-xl">{p.flag}</span>
              <span className="text-sm font-medium">{p.label}</span>
              <span className="text-[10px] font-mono">{p.sub}</span>
            </button>
          ))}
        </div>

        {/* Pay button */}
        <button
          onClick={handlePay}
          disabled={processing}
          className="w-full bg-teal text-white py-3.5 rounded-xl font-medium text-sm
                     hover:bg-teal-dark transition-all disabled:opacity-50
                     disabled:cursor-not-allowed"
        >
          {processing
            ? "Processing…"
            : `Pay ${label} via ${provider === "razorpay" ? "Razorpay" : "Stripe"}`}
        </button>

        <p className="text-faint text-xs text-center mt-4 font-mono">
          Secured · SSL encrypted · No data stored
        </p>
      </div>
    </div>
  );
}
