import { PROFILE } from "@/lib/constants";

export function Footer() {
  return (
    <footer className="bg-void border-t border-border py-10">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row
                      justify-between items-center gap-6">
        <div>
          <p className="text-teal-light font-mono text-sm mb-1">⬡ BAPPADITYA.DEV</p>
          <p className="text-dim text-xs">
            Analytics Engineer · NIT Agartala · M.Sc Math & Computing
          </p>
        </div>

        <div className="flex gap-6">
          <a
            href={PROFILE.github}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim text-xs font-mono hover:text-teal-light transition-colors"
          >
            GitHub ↗
          </a>
          <a
            href={PROFILE.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="text-dim text-xs font-mono hover:text-teal-light transition-colors"
          >
            LinkedIn ↗
          </a>
          <a
            href={`mailto:${PROFILE.email}`}
            className="text-dim text-xs font-mono hover:text-teal-light transition-colors"
          >
            Email ↗
          </a>
        </div>

        <p className="text-faint text-xs font-mono">
          © 2025 Bappaditya Maity
        </p>
      </div>
    </footer>
  );
}
