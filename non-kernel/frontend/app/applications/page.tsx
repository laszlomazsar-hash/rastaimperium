import Link from "next/link";

export const metadata = {
  title: "Applications — EVO-V Ecosystem",
  description:
    "Public pointers to EVO-V ecosystem surfaces. Demonstration and external prototypes are labelled explicitly; this page is not the execution runtime.",
};

const apps = [
  {
    title: "EVO-V Cloud Control",
    description:
      "Sovereign cloud orchestration surface with constitutional framing. Telemetry, state views, and logging presented for inspection. Status relative to sealed public capsules remains external to this site.",
    url: "https://evo-vcloudcon.lovable.app",
    github: "https://github.com/laszlomazsar-hash/evo-v",
    badge: "CORE INFRASTRUCTURE",
    status: "DEMONSTRATION",
  },
  {
    title: "Virtual Power Plant",
    description:
      "Energy coordination prototype operating under constitutional narrative constraints. Decision chains are presented for inspection; production grid claims are not asserted here.",
    url: "https://virtualpowerplant.lovable.app",
    badge: "ENERGY GOVERNANCE",
    status: "DEMONSTRATION",
  },
  {
    title: "EVO-V Investment Portal",
    description:
      "Public investment and milestone interface for the EVO-V ecosystem. Tracks narrative progress and governance framing. Not a securities offering and not a verified performance surface.",
    url: "https://evo-vision-launch.lovable.app",
    badge: "INVESTMENT",
    status: "DEMONSTRATION",
  },
  {
    title: "EVO-V Vista — 100 Governed Agents",
    description:
      "Multi-agent orchestration demonstration. Agents are shown operating within deterministic governance narrative boundaries. Scale and reliability claims require sealed artifacts not yet published on this surface.",
    url: "https://evo-vista-core.lovable.app",
    badge: "MULTI-AGENT",
    status: "DEMONSTRATION",
  },
];

export default function ApplicationsPage() {
  return (
    <main className="royal-page">
      <section className="container-page border-b border-[#B8860B]/20 py-16 lg:py-24">
        <p className="royal-kicker text-xs font-semibold uppercase tracking-[0.32em] text-[#B8860B]">
          Ecosystem surfaces · public pointers
        </p>
        <h1 className="royal-title mt-5 max-w-3xl text-4xl leading-tight text-zinc-50 sm:text-5xl">
          EVO-V Applications
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
          Public pointers to related EVO-V surfaces. Each entry is labelled DEMONSTRATION on this
          site. This page is not the execution runtime, does not host sealed production telemetry,
          and does not claim independently verified performance metrics.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/proof/"
            className="rounded-lg border border-[#B8860B]/50 px-5 py-2.5 text-sm font-semibold text-[#F2D675]"
          >
            Proof Registry
          </Link>
          <Link
            href="/evidence/"
            className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200"
          >
            Evidence Explorer
          </Link>
          <Link
            href="/blueprint/#verifiable-stack"
            className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200"
          >
            Architecture
          </Link>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <article
              key={app.title}
              className="rounded-xl border border-zinc-800 bg-black/30 p-6 transition hover:border-[#B8860B]/40"
            >
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                  {app.badge}
                </p>
                <span className="rounded border border-amber-900/50 bg-amber-950/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-200/80">
                  {app.status}
                </span>
              </div>
              <h2 className="mt-3 text-xl font-semibold text-zinc-100">{app.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{app.description}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black transition hover:bg-[#F2D675]"
                >
                  Open surface
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13 7l5 5m0 0l-5 5m5-5H6"
                    />
                  </svg>
                </a>
                {app.github && (
                  <a
                    href={app.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-lg border border-zinc-700 px-4 py-2 text-sm text-zinc-300 transition hover:border-[#B8860B]/50 hover:text-[#F2D675]"
                  >
                    GitHub
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-xl border border-zinc-800 bg-black/20 p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            Boundary note
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            These links point to external or related surfaces. On rastaimperium.com they are
            labelled DEMONSTRATION. Sealed, independently reproducible capsules live in the Proof
            Registry and Evidence Explorer. Production runtime metrics remain UNAVAILABLE until
            public artifacts are attached.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/proof/" className="text-sm text-[#F2D675]">
              Open Proof Registry →
            </Link>
            <Link href="/institutional-pilots/" className="text-sm text-zinc-400">
              Institutional pilots →
            </Link>
            <Link href="/thanks-and-praise/" className="text-sm text-zinc-400">
              Thanks & Praise →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
