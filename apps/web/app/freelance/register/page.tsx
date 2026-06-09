"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (session) {
      router.replace("/freelance/dashboard");
    } else {
      router.replace("/auth/signin?callbackUrl=/freelance/dashboard");
    }
  }, [session, status, router]);

  return (
    <main className="min-h-screen bg-void flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-teal/30 border-t-teal
                        rounded-full animate-spin" />
        <p className="text-dim font-mono text-xs">Redirecting…</p>
      </div>
    </main>
  );
}
