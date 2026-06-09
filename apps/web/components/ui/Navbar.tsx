"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { PROFILE } from "@/lib/constants";

const NAV_LINKS = [
  { label: "About",   href: "#about"    },
  { label: "Journey", href: "#journey"  },
  { label: "Domains", href: "#domains"  },
  { label: "Hire me", href: "#freelance"},
  { label: "Chat",    href: "#chat"     },
];

export function Navbar() {
  const { data: session } = useSession();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-surface/90 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      )}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <span className="text-teal-light font-mono text-sm tracking-widest">⬡</span>
          <span className="text-teal-light font-mono text-sm font-medium tracking-wider group-hover:text-teal transition-colors">
            BAPPADITYA.DEV
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted text-sm hover:text-teal-light transition-colors font-mono"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <div className="flex items-center gap-3">
              <Link
                href="/freelance/dashboard"
                className="text-muted text-sm hover:text-teal-light transition-colors font-mono"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="text-dim text-sm hover:text-muted transition-colors font-mono"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              href="/freelance"
              className="border border-teal/40 text-teal-light text-sm px-4 py-2 rounded-lg
                         hover:bg-teal/10 transition-all font-mono"
            >
              Book a call
            </Link>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden text-muted"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <div className={cn("w-5 h-0.5 bg-current mb-1 transition-all", menuOpen && "rotate-45 translate-y-1.5")} />
          <div className={cn("w-5 h-0.5 bg-current mb-1 transition-all", menuOpen && "opacity-0")} />
          <div className={cn("w-5 h-0.5 bg-current transition-all", menuOpen && "-rotate-45 -translate-y-1.5")} />
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur-md border-t border-border px-6 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-muted text-sm hover:text-teal-light transition-colors font-mono"
              onClick={() => setMenuOpen(false)}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/freelance"
            className="border border-teal/40 text-teal-light text-sm px-4 py-2 rounded-lg
                       hover:bg-teal/10 transition-all font-mono text-center mt-2"
          >
            Book a call
          </Link>
        </div>
      )}
    </nav>
  );
}
