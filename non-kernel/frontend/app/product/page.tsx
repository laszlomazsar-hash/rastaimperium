import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Product — What you can use and buy",
  description:
    "Commercial pathway for EVO-V constitutional governance: design partner pilots, verification surface, runtime roadmap. Evidence-bound; no invented case studies.",
};

const surfaces = [
  {
    status: "OPERATIONAL",
    title: "Verification surface",
    body: "Proof Registry, Evidence Explorer, Challenge Lab, auditor handoff. Public, inspectable, capsule-scoped.",
    href: "/proof/",
    cta: "Open Proof Registry",
  },
  {
    status: "PILOT PATH",
    title: "Design partner pilots",
    body: "Scoped institutional pilots: constitution mapping, evidence review, challenge fixtures, written boundary of scope.",
    href: "/institutional-pilots/",
    cta: "Apply for a pilot",
  },
  {
    status: "DEMONSTRATION",
    title: "Applications & demos",
    body: "Ecosystem surfaces and synthetic telemetry labelled DEMONSTRATION — not production SaaS or live monitoring.",
    href: "/applications/",
    cta: "View applications",
  },
  {
    status: "SEPARATE LAYER",
    title: "EVO-V execution kernel",
    body: "Runtime governance logic lives outside this site. Documented here; executed in dedicated repositories and deployments.",
    href: "/about-evo-v-kernel/",
    cta: "About the kernel",
  },
];

const journey = [
  {
    step: "01",
    title: "Problem",
    body: "Your AI systems make decisions you cannot reconstruct, challenge, or bound under policy.",
  },
  {
    step: "02",
    title: "Evidence",
    body: "Review sealed capsules, limitations, and challenge fixtures before any commercial discussion.",
  },
  {
    step: "03",
    title: "Pilot",
    body: "Scoped design partner engagement with written success criteria and explicit non-goals.",
  },
  {
    step: "04",
    title: "Production path",
    body: "Runtime integration, hosted observatory, or air-gapped license — only after pilot evidence and mutual fit.",
  },
];

const commercial = [
  {
    title: "Design partner pilot",
    detail:
      "Fixed-scope engagement for regulated or high-accountability teams. Custom constitution mapping, integration support, invariant enforcement on an agreed subset of your stack.",
    action: "Contact for pilot terms",
    href: "/contact/?intent=design-partner",
  },
  {
    title: "Governance audit & certification path",
    detail:
      "Use the verification surface and challenge battery to assess whether a system meets stated constitutional invariants. Certification language only where evidence supports it.",
    action: "Discuss audit scope",
    href: "/contact/?intent=audit",
  },
  {
    title: "Runtime & hosted modules",
    detail:
      "Execution kernel, observatory dashboard, and advanced epistemic modules are the commercial layer. Pricing and packaging are scoped per engagement — not published as self-serve SaaS on this site.",
    action: "Request commercial brief",
    href: "/contact/?intent=commercial",
  },
];

export default function ProductPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Product · commercial pathway
          </p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Governance you can inspect.
            <span className="mt-2 block text-gold-gradient">Pilots you can buy.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            This site is the public constitutional and verification layer — not the execution runtime
            and not a self-serve SaaS storefront. The commercial path starts with evidence and
            scoped design partner pilots for teams that cannot allow autonomous systems to fail
            without a reconstructible record.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/institutional-pilots/"
              className="rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Pilot with us
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Read Limitations first
            </Link>
            <Link
              href="/contact/?intent=design-partner"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Contact sales path
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          What exists today
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {surfaces.map((s) => (
            <Link
              key={s.title}
              href={s.href}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition hover:border-[#B8860B]/40"
            >
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
                {s.status}
              </p>
              <h2 className="mt-2 text-lg font-semibold text-zinc-100">{s.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{s.body}</p>
              <p className="mt-4 text-sm text-[#F2D675]">{s.cta} →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Buying journey
        </p>
        <h2 className="mt-3 text-2xl text-zinc-100">Problem → evidence → pilot → production</h2>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {journey.map((j) => (
            <li key={j.step} className="rounded-xl border border-zinc-800 bg-black/30 p-5">
              <p className="font-mono text-[11px] text-zinc-500">{j.step}</p>
              <h3 className="mt-2 text-lg text-[#F2D675]">{j.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{j.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Commercial models
        </p>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Pricing is engagement-scoped. No published self-serve tiers on this surface. No logos or
          outcome claims are shown without sealed public evidence or named customer permission.
        </p>
        <div className="mt-8 grid gap-4 lg:grid-cols-3">
          {commercial.map((c) => (
            <div key={c.title} className="rounded-xl border border-zinc-800 bg-black/30 p-5">
              <h3 className="text-lg text-zinc-100">{c.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{c.detail}</p>
              <Link href={c.href} className="mt-4 inline-block text-sm text-[#F2D675]">
                {c.action} →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="text-2xl text-zinc-100">Ready for a scoped pilot?</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Bring the decision context, evidence requirements, and success criteria. We respond with
            a written boundary of what is in scope — and what is not.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Apply · design partner
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Pilot pathway detail
            </Link>
            <Link href="/about/" className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100">
              About the founder
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
