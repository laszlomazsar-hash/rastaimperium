import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Institutional Pilots — High-Accountability Environments",
  description:
    "Scoped pilot programs for regulated and high-accountability environments: problem, method, evidence, challenge, pilot, assurance.",
};

const journey = [
  {
    step: "Problem",
    title: "Governance risk",
    body: "Autonomous systems that cannot be reconstructed, challenged, or constrained create institutional liability.",
  },
  {
    step: "Method",
    title: "Deterministic constitutional control",
    body: "EVO-V-style governance: ordered events, version bundles, legal transition matrices, and append-only lineage.",
  },
  {
    step: "Evidence",
    title: "Proof · receipts · replay",
    body: "Public claims connect to the Proof Registry and Evidence Explorer. Unavailable artifacts are labelled, not invented.",
    href: "/evidence/",
  },
  {
    step: "Challenge",
    title: "Adversarial verification",
    body: "Safe deterministic challenges exercise illegal transitions, replay mismatch, and receipt integrity.",
    href: "/challenge/",
  },
  {
    step: "Pilot",
    title: "Controlled institutional deployment",
    body: "Scoped pilots in regulated environments before operational scale-up. Scope and success criteria agreed in writing.",
  },
  {
    step: "Assurance",
    title: "Ongoing audit / replay / evidence",
    body: "Continuous verification surface rather than one-time certification theatre.",
    href: "/trust/",
  },
];

const offered = [
  "Scoped pilot design against a defined governance problem",
  "Mapping of claims to public evidence and limitations",
  "Access to Challenge Lab fixtures and auditor handoff path",
  "Written boundary of what is and is not in scope",
];

const notOffered = [
  "Production runtime guarantees without sealed artifacts",
  "Blanket certification or “court-ready” claims without evidence",
  "Open-ended SaaS deployment without institutional scope",
  "Performance benchmarks labelled VERIFIED without public capsules",
];

export default function InstitutionalPilotsPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="container-page relative py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Institutional Pilots
          </p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Prove the system <span className="text-gold-gradient">before it scales.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Pilot programs are scoped for regulated and high-accountability environments where
            replay, traceability, and governance assurance are required before operational adoption.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/limitations/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Read Limitations first
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Proof Registry
            </Link>
            <Link
              href="/contact/"
              className="rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Contact engagement desk
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
              What a pilot can include
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {offered.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="text-[#B8860B]">·</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
              What is not offered here
            </p>
            <ul className="mt-4 space-y-2 text-sm text-zinc-300">
              {notOffered.map((o) => (
                <li key={o} className="flex gap-2">
                  <span className="text-zinc-600">·</span>
                  <span>{o}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <h2 className="text-sm font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Institutional journey
        </h2>
        <ol className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {journey.map((j, i) => (
            <li key={j.step} className="rounded-xl border border-zinc-800 bg-black/30 p-6">
              <p className="font-mono text-[11px] text-zinc-500">
                {String(i + 1).padStart(2, "0")} · {j.step}
              </p>
              <h3 className="mt-2 text-lg text-[#F2D675]">{j.title}</h3>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{j.body}</p>
              {j.href && (
                <Link href={j.href} className="mt-4 inline-block text-xs text-[#F2D675]">
                  Open →
                </Link>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-14 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <p className="text-zinc-300">Ready to discuss a scoped pilot?</p>
          <p className="mt-2 text-sm text-zinc-500">
            Bring the decision context, evidence requirements, and desired next step.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact/"
              className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F2D675]"
            >
              Contact engagement desk
            </Link>
            <Link
              href="/audit/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
            >
              Auditor handoff
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
