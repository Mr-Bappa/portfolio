"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function SignInContent() {
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/freelance/dashboard";
  const [loading, setLoading] = useState<string | null>(null);

  const handleSignIn = async (provider: "google" | "github") => {
    setLoading(provider);
    await signIn(provider, { callbackUrl });
  };

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-teal/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-violet/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <span className="text-teal-light font-mono text-lg">⬡</span>
            <span className="text-teal-light font-mono text-sm tracking-widest">
              BAPPADITYA.DEV
            </span>
          </Link>
          <p className="text-dim font-mono text-xs mt-3 tracking-widest uppercase">
            Client portal
          </p>
        </div>

        <div className="glass p-8 rounded-2xl">
          <h1 className="text-white/90 text-xl font-medium mb-2 text-center">
            Sign in to continue
          </h1>
          <p className="text-muted text-sm text-center mb-8">
            Create tasks, track progress, manage payments
          </p>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => handleSignIn("google")}
              disabled={loading !== null}
              className="flex items-center justify-center gap-3 w-full border border-border text-white/80 text-sm py-3 px-4 rounded-xl hover:border-teal/30 hover:bg-teal/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "google" ? <Spinner /> : <GoogleIcon />}
              Continue with Google
            </button>

            <button
              onClick={() => handleSignIn("github")}
              disabled={loading !== null}
              className="flex items-center justify-center gap-3 w-full border border-border text-white/80 text-sm py-3 px-4 rounded-xl hover:border-violet/30 hover:bg-violet/5 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading === "github" ? <Spinner /> : <GitHubIcon />}
              Continue with GitHub
            </button>
          </div>

          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-border" />
            <span className="text-faint text-xs font-mono">secure OAuth</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          <div className="flex justify-center gap-6">
            {["Razorpay", "Stripe", "SSL"].map((b) => (
              <span key={b} className="text-faint font-mono text-[10px]">
                ✓ {b}
              </span>
            ))}
          </div>
        </div>

        <p className="text-faint text-xs text-center mt-6 font-mono">
          By signing in you agree to our terms of service
        </p>

        <div className="text-center mt-4">
          <Link href="/" className="text-dim text-xs hover:text-teal-light transition-colors">
            ← Back to portfolio
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<Loader />}>
      <SignInContent />
    </Suspense>
  );
}

function Loader() {
  return (
    <main className="min-h-screen bg-void flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
    </main>
  );
}

function Spinner() {
  return (
    <div className="w-4 h-4 border-2 border-teal/30 border-t-teal rounded-full animate-spin" />
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18">
      <path fill="#4285F4" d="M17.64 9.2a10.3 10.3 0 0 0-.16-1.82H9v3.45h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9a8.78 8.78 0 0 0 2.7-6.61z" />
      <path fill="#34A853" d="M9 18a8.6 8.6 0 0 0 5.96-2.18l-2.9-2.26a5.43 5.43 0 0 1-8.07-2.85H.96v2.33A9 9 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.99 10.71a5.36 5.36 0 0 1 0-3.42V4.96H.96a9 9 0 0 0 0 8.08l3.03-2.33z" />
      <path fill="#EA4335" d="M9 3.58a4.86 4.86 0 0 1 3.44 1.35l2.58-2.58A8.64 8.64 0 0 0 9 0 9 9 0 0 0 .96 4.96L4 7.3A5.36 5.36 0 0 1 9 3.58z" />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.2 11.39.6.11.82-.26.82-.58v-2.03c-3.34.72-4.04-1.61-4.04-1.61-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.09 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.5.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 3-.4c1.02 0 2.04.14 3 .4 2.28-1.55 3.29-1.23 3.29-1.23.66 1.66.24 2.88.12 3.18.77.84 1.24 1.91 1.24 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.81 1.1.81 2.22v3.29c0 .32.22.7.83.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}