"use client";

import { useState } from "react";
import { DOMAINS } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ICONS: Record<string, string> = {
  "git-branch": "⑂",
  "brain": "◈",
  "adjustments": "⊹",
  "table": "▦",
  "chart-bar": "▮",
  "cloud": "☁",
};

export function DomainsSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section id="domains" className="py-20 bg-surface/30">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-dim font-mono text-xs text-center tracking-widest uppercase mb-2">
          What I build
        </p>
        <h2 className="text-2xl font-medium text-center text-white/90 mb-12">
          Domain expertise
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {DOMAINS.map((d) => (
            <div
              key={d.id}
              onMouseEnter={() => setHovered(d.id)}
              onMouseLeave={() => setHovered(null)}
              className={cn(
                "glass p-6 rounded-xl cursor-default transition-all duration-300 group",
                hovered === d.id
                  ? "border-teal/40 bg-teal-dark/10 scale-[1.02]"
                  : "border-border"
              )}
            >
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-content-center mb-4",
                "bg-teal-dark/20 border border-teal/20 text-teal-light text-xl",
                "transition-all duration-300",
                hovered === d.id && "bg-teal-dark/40 border-teal/40",
                "flex items-center justify-center"
              )}>
                <span>{ICONS[d.icon]}</span>
              </div>

              <h3 className="text-white/90 text-sm font-medium mb-1">{d.title}</h3>
              <p className="text-dim font-mono text-xs mb-3">{d.desc}</p>

              <p className={cn(
                "text-muted text-xs leading-relaxed transition-all duration-300",
                hovered === d.id ? "opacity-100" : "opacity-0 h-0 overflow-hidden"
              )}>
                {d.detail}
              </p>

              {/* Hover indicator */}
              <div className={cn(
                "mt-4 h-0.5 bg-gradient-to-r from-teal to-violet transition-all duration-500",
                hovered === d.id ? "w-full opacity-100" : "w-0 opacity-0"
              )} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
