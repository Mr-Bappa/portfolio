"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

const ERRORS: Record<string, string> = {
  OAuthSignin:    "Failed to start OAuth sign-in.",
  OAuthCallback:  "OAuth callback failed.",
  OAuthCreateAccount: "Could not create your account.",
  Default:        "An unexpected error occurred.",
};

export default function AuthErrorPage() {
  const params = useSearchParams();
  const error  = params.get("error") ?? "Default";
  const msg    = ERRORS[error] ?? ERRORS.Default;

  return (
    <main className="min-h-screen bg-void flex items-center justify-center px-4">
      <div className="glass p-8 rounded-2xl max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30
                        flex items-center justify-center mx-auto mb-4">
          <span className="text-red-400 text-xl">!</span>
        </div>
        <h1 className="text-white/90 text-lg font-medium mb-2">Sign in failed</h1>
        <p className="text-muted text-sm mb-6">{msg}</p>
        <Link
          href="/auth/signin"
          className="inline-block bg-teal text-white text-sm px-6 py-2.5
                     rounded-lg hover:bg-teal-dark transition-all"
        >
          Try again
        </Link>
      </div>
    </main>
  );
}
