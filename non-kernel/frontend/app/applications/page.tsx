import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Applications — EVO-V Ecosystem",
  description:
    "EVO-V applications and Genesis artifacts: verification surface, design partner path, kernel, Observatory, Fitness DSL, and demonstration ecosystem apps. Labels are explicit.",
};

const genesis = [
  {
    title: "Verification surface",
    description:
      "Proof Registry, Evidence Explorer, Challenge Lab, and auditor handoff on this site. Capsule-scoped VERIFIED artifacts; benchmarks remain UNAVAILABLE until sealed.",
    status: "OPERATIONAL",
    badge: "PUBLIC LAYER",
    href: "/proof/",
    cta: "Open Proof Registry",
  },
  {
    title: "Design partner pilots",
    description:
      "Fixed-scope paid engagements: constitution mapping, integration support, invariant enforcement on an agreed subset. Indicative $50k–$150k / 8–12 weeks.",
    status: "PILOT PATH",
    badge: "COMMERCIAL",
    href: "/institutional-pilots/",
    cta: "Apply for pilot",
  },
  {
    title: "EVO-V execution kernel",
    description:
      "Deterministic governance runtime — separate from this website. Replay, lifecycle rejection, and ledger logic live in dedicated repositories and deployments.",
    status: "SEPARATE LAYER",
    badge: "GENESIS · KERNEL",
    href: "/about-evo-v-kernel/",
    cta: "About the kernel",
    external: "https://github.com/laszlomazsar-hash/evo-v",
    externalLabel: "Kernel repo",
  },
  {
    title: "Observatory",
    description:
      "Operator-facing coherence, drift, and governed-agent visibility. Synthetic telemetry on this site is DEMONSTRATION only. Hosted Observatory modules ship under commercial runtime scope after pilot fit.",
    status: "DEMONSTRATION + COMMERCIAL",
    badge: "GENESIS · OBSERVATORY",
    href: "/observatory/",
    cta: "Open Observatory demo",
  },
  {
    title: "Fitness DSL & invariants",
    description:
      "Policy and invariant expression surface used in pilot constitution mapping. Not a public self-serve product on this site; delivered under written pilot or runtime scope.",
    status: "PILOT / RUNTIME",
    badge: "GENESIS · DSL",
    href: "/product/",
    cta: "Commercial models",
  },
  {
    title: "Design partner onboarding",
    description:
      "Structured intake: organisation, stack, risk surface, success criteria, compliance context. Start at Contact with intent=design-partner after Limitations and Proof.",
    status: "OPERATIONAL",
    badge: "ONBOARDING",
    href: "/contact/?intent=design-partner",
    cta: "Start intake",
  },
];

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
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Ecosystem · Genesis · demonstrations
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            EVO-V Applications
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            What exists to inspect, pilot, or demonstrate. Genesis artifacts (kernel, Observatory,
            Fitness DSL) are labelled by layer. External demos remain DEMONSTRATION. This page is not
            the production runtime and does not publish sealed performance guarantees.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/product/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/observatory/"
              className="rounded-lg border border-[#B8860B]/50 px-5 py-2.5 text-sm font-semibold text-[#F2D675]"
            >
              Observatory demo
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200"
            >
              Proof Registry
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200"
            >
              Design partner pilots
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-200"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Genesis product surface
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Artifacts from the constitutional stack</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Mapped to what institutional buyers and auditors can actually reach today. Runtime modules
          are sold under explicit scope after pilot fit.
        </p>
        <div className="mt-8 grid gap-4 md:grid-cols-2">
          {genesis.map((item) => (
            <article key={item.title} className="royal-panel rounded-xl border p-6">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                  {item.badge}
                </p>
                <span className="rounded border border-zinc-700 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
                  {item.status}
                </span>
              </div>
              <h3 className="mt-3 text-lg font-semibold text-zinc-100">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{item.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <Link href={item.href} className="text-sm font-semibold text-[#F2D675]">
                  {item.cta} →
                </Link>
                {"external" in item && item.external && (
                  <a
                    href={item.external}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-zinc-400 hover:text-[#F2D675]"
                  >
                    {item.externalLabel} ↗
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Demonstration surfaces
        </p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">External ecosystem pointers</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Each card below is labelled DEMONSTRATION. Useful for orientation; not a substitute for
          sealed capsules or a paid pilot boundary.
        </p>
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {apps.map((app) => (
            <article key={app.title} className="royal-panel rounded-xl border p-6">
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

        <div className="mt-16 royal-panel rounded-xl border p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            Boundary note
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            Demonstration links point to external or related surfaces. Genesis runtime and
            Observatory modules are commercial layers. Sealed, independently reproducible capsules
            live in the Proof Registry and Evidence Explorer. Production metrics remain UNAVAILABLE
            until public artifacts are attached.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            <Link href="/proof/" className="text-sm text-[#F2D675]">
              Open Proof Registry →
            </Link>
            <Link href="/evidence/" className="text-sm text-zinc-400">
              Evidence Explorer →
            </Link>
            <Link href="/limitations/" className="text-sm text-zinc-400">
              Limitations →
            </Link>
            <Link href="/product/" className="text-sm text-zinc-400">
              Product pathway →
            </Link>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-xl text-zinc-100">From demos to scoped engagement</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Demos orient. Pilots define written boundaries. Runtime modules follow mutual fit.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=commercial"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Commercial brief
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Design partner pilots
            </Link>
            <Link
              href="/contact/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
