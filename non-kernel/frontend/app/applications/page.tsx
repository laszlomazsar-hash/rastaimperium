export const metadata = {
  title: "Applications — EVO-V Ecosystem",
  description: "Live sovereign applications powered by the EVO-V constitutional intelligence framework.",
};

const apps = [
  {
    title: "EVO-V Cloud Control",
    description:
      "Sovereign cloud orchestration with constitutional governance. Real-time telemetry, deterministic state management, and audit-grade logging for autonomous infrastructure.",
    url: "https://evo-vcloudcon.lovable.app",
    github: "https://github.com/laszlomazsar-hash/evo-v",
    badge: "CORE INFRASTRUCTURE",
  },
  {
    title: "Virtual Power Plant",
    description:
      "Decentralized energy governance operating under constitutional constraints. Grid-scale coordination with replay-verifiable decision chains and sovereign resource allocation.",
    url: "https://virtualpowerplant.lovable.app",
    badge: "ENERGY GOVERNANCE",
  },
  {
    title: "EVO-V Investment Portal",
    description:
      "Transparent investment interface for the EVO-V ecosystem. Track development milestones, governance metrics, and participate in the constitutional intelligence revolution.",
    url: "https://evo-vision-launch.lovable.app",
    badge: "INVESTMENT",
  },
  {
    title: "EVO-V Vista — 100 Governed Agents",
    description:
      "Multi-agent orchestration at scale. One hundred autonomous agents operating within deterministic governance boundaries — replayable, auditable, sovereign.",
    url: "https://evo-vista-core.lovable.app",
    badge: "MULTI-AGENT",
  },
];

export default function ApplicationsPage() {
  return (
    <main className="container-page py-16 px-4 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h1
          className="text-4xl md:text-5xl text-[#B8860B] mb-4"
          style={{ fontFamily: "'Cinzel', Georgia, serif" }}
        >
          EVO-V Applications
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto leading-relaxed">
          Live sovereign applications powered by the EVO-V constitutional intelligence framework.
          Each system operates under deterministic governance — replayable, auditable, and
          cryptographically verifiable.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {apps.map((app) => (
          <div
            key={app.title}
            className="border border-[#B8860B]/30 rounded-xl p-8 hover:border-[#B8860B]/60 transition-all duration-300 hover:shadow-[0_0_30px_rgba(184,134,11,0.1)]"
            style={{ background: "rgba(20,20,20,0.8)" }}
          >
            <p className="text-xs text-[#B8860B] tracking-[0.2em] mb-3 font-bold">
              {app.badge}
            </p>
            <h2
              className="text-2xl text-zinc-100 mb-3"
              style={{ fontFamily: "'Cinzel', Georgia, serif" }}
            >
              {app.title}
            </h2>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              {app.description}
            </p>
            <div className="flex gap-3">
              <a
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-md bg-[#B8860B] text-black px-5 py-2.5 text-sm font-bold hover:bg-yellow-700 transition"
              >
                Launch App
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </a>
              {app.github && (
                <a
                  href={app.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-700 text-zinc-300 px-5 py-2.5 text-sm hover:border-[#B8860B]/50 hover:text-[#B8860B] transition"
                >
                  GitHub
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-16 text-center border-t border-[#B8860B]/20 pt-12">
        <p className="text-zinc-500 text-sm max-w-xl mx-auto">
          All applications operate under the EVO-V Constitutional Framework — seven articles of
          deterministic governance enforced at the hardware level. No decision escapes the ledger.
        </p>
      </div>
    </main>
  );
}
