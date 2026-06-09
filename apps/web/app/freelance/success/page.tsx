import Link from "next/link";
import { Navbar } from "@/components/ui/Navbar";

export default function SuccessPage() {
  return (
    <main className="min-h-screen bg-void">
      <Navbar />
      <div className="pt-40 pb-20 flex flex-col items-center justify-center px-6 text-center">
        <div className="w-16 h-16 rounded-full bg-teal-dark/30 border border-teal/40
                        flex items-center justify-center mb-6 text-2xl">
          ✓
        </div>
        <h1 className="text-2xl font-medium text-white/90 mb-3">Payment successful!</h1>
        <p className="text-muted text-sm mb-8 max-w-sm">
          Your task has been created and payment confirmed.
          I'll begin work shortly and keep you updated.
        </p>
        <div className="flex gap-4">
          <Link
            href="/freelance/dashboard"
            className="bg-teal text-white px-6 py-3 rounded-lg text-sm hover:bg-teal-dark transition-all"
          >
            View dashboard
          </Link>
          <Link
            href="/"
            className="border border-border text-muted px-6 py-3 rounded-lg text-sm
                       hover:border-teal/30 hover:text-teal-light transition-all"
          >
            Back to portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}
