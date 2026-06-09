"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function AuthErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <main>
      <h1>Authentication Error</h1>
      <p>{error || "Something went wrong during sign in."}</p>
    </main>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <AuthErrorContent />
    </Suspense>
  );
}