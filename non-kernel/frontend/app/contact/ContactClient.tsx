"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import EnquiryForm from "./EnquiryForm";

const engagementPaths = [
  {
    code: "01",
    title: "Design partner pilot",
    description:
      "Fixed-scope paid pilots for regulated and high-accountability teams. Constitution mapping, integration support, written boundary.",
    prompt: "Design partner pilot inquiry",
    label: "Apply for a design partner pilot",
    intent: "design-partner",
  },
  {
    code: "02",
    title: "Institutional governance",
    description:
      "For organisations evaluating constitutional controls, replayability, or accountable AI operating models.",
    prompt: "Institutional governance inquiry",
    label: "Start an institutional inquiry",
    intent: "institutional",
  },
  {
    code: "03",
    title: "Research collaboration",
    description:
      "For researchers exploring deterministic intelligence, epistemic governance, and verifiable system design.",
    prompt: "Research collaboration inquiry",
    label: "Discuss a research collaboration",
    intent: "research",
  },
  {
    code: "04",
    title: "Technical / commercial brief",
    description:
      "Runtime, Observatory, audit path, or packaging questions after reviewing Product and Limitations.",
    prompt: "EVO-V commercial / technical inquiry",
    label: "Request a commercial brief",
    intent: "commercial",
  },
  {
    code: "05",
    title: "Governance audit",
    description:
      "Assessment against stated invariants. Certification language only where sealed artifacts support it.",
    prompt: "Governance audit inquiry",
    label: "Open an audit inquiry",
    intent: "audit",
  },
];

function inquiryHref(subject: string) {
  return `mailto:lazzlowtuning@me.com?subject=${encodeURIComponent(subject)}`;
}

function ContactBody() {
  const searchParams = useSearchParams();
  const intent = (searchParams.get("intent") || "").toLowerCase();
  const isPilot = intent === "design-partner" || intent === "pilot";
  const isAudit = intent === "audit";
  const isCommercial = intent === "commercial";
  const isResearch = intent === "research";
  const isInstitutional = intent === "institutional";

  const bannerTitle = isPilot
    ? "Design partner pilot intake"
    : isAudit
      ? "Governance audit inquiry"
      : isCommercial
        ? "Commercial / runtime brief"
        : isResearch
          ? "Research collaboration"
          : isInstitutional
            ? "Institutional governance inquiry"
            : "Begin with the governance question that matters.";

  const bannerBody = isPilot
    ? "You are on the design partner path. Share decision context, systems in scope, compliance requirements, and success criteria. Indicative pilot investment is $50k–$150k for an 8–12 week fixed scope."
    : isAudit
      ? "Describe the system under review, the invariants you care about, and the evidence standard you need. Certification language only where sealed artifacts support it."
      : isCommercial
        ? "Runtime, Observatory, and hosted modules are sold under explicit scope after pilot fit. Include stack constraints (cloud vs air-gapped) and scale."
        : isResearch
          ? "Share the research question, collaboration model, and any publication or evidence constraints. This surface remains evidence-bound."
          : isInstitutional
            ? "Share the institutional context, decision boundary, and what accountable autonomy must look like for your environment."
            : "Rasta Imperium works at the boundary of constitutional intelligence, verifiable systems, and accountable deployment. Select a path below or send context via the form.";

  return (
    <main className="relative overflow-hidden bg-[#090a09] text-zinc-100">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(ellipse_at_50%_0%,rgba(34,197,94,0.14),transparent_64%)]"
      />

      <section className="relative mx-auto max-w-6xl px-6 pb-16 pt-24 sm:pb-24 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#D4AF37]">
              Engagement desk
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-4xl leading-[1.05] text-[#F2D675] sm:text-6xl">
              {bannerTitle}
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-zinc-300">{bannerBody}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {engagementPaths.map((p) => (
                <Link
                  key={p.intent}
                  href={`/contact/?intent=${p.intent}`}
                  className={`rounded-full px-3 py-1.5 text-xs font-semibold transition ${
                    intent === p.intent || (isPilot && p.intent === "design-partner")
                      ? "bg-[#D4AF37] text-black"
                      : "border border-zinc-600 text-zinc-300 hover:border-[#D4AF37]/60"
                  }`}
                >
                  {p.title}
                </Link>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#enquiry-form"
                className="rounded-full bg-[#D4AF37] px-6 py-3 text-sm font-bold text-[#12130f] transition hover:bg-[#F2D675] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2D675]"
              >
                {isPilot ? "Open pilot form" : "Open enquiry form"}
              </a>
              <a
                href={inquiryHref(
                  isPilot
                    ? "Design partner pilot inquiry"
                    : isAudit
                      ? "Governance audit inquiry"
                      : isCommercial
                        ? "Commercial brief inquiry"
                        : isResearch
                          ? "Research collaboration inquiry"
                          : "Rasta Imperium inquiry",
                )}
                className="rounded-full border border-[#D4AF37]/45 px-6 py-3 text-sm font-semibold text-[#F2D675] transition hover:border-[#F2D675] hover:bg-[#D4AF37]/10"
              >
                Email instead
              </a>
              <Link
                href="/limitations/"
                className="rounded-full border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70"
              >
                Limitations
              </Link>
            </div>
          </div>

          <aside className="border border-[#D4AF37]/25 bg-[#11150f]/85 p-6 shadow-[0_20px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-7">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#D4AF37]">
              {isPilot ? "Pilot checklist" : "A useful first note"}
            </p>
            {isPilot ? (
              <ul className="mt-4 space-y-2 text-sm leading-6 text-zinc-300">
                <li>· Organisation & role</li>
                <li>· Stack / environment</li>
                <li>· Risk surface in scope</li>
                <li>· Success criteria for 8–12 weeks</li>
                <li>· Compliance context (if any)</li>
              </ul>
            ) : (
              <p className="mt-4 text-base leading-7 text-zinc-200">
                Share the decision context, the systems or institutions involved, and the governance
                question you need to resolve.
              </p>
            )}
            <Link
              href="/case-studies/"
              className="mt-6 inline-flex text-sm font-semibold text-[#F2D675] underline decoration-[#D4AF37]/45 underline-offset-4 transition hover:decoration-[#F2D675]"
            >
              How we publish evidence →
            </Link>
          </aside>
        </div>
      </section>

      <section className="relative border-y border-[#D4AF37]/20 bg-[#0d100d]">
        <div className="mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
                Choose a pathway
              </p>
              <h2 className="mt-3 font-serif text-3xl text-[#F2D675] sm:text-4xl">
                A clear route into the conversation.
              </h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-400">
              Chips above and cards below share the same intents. Each route can open a prepared
              email subject or the form below.
            </p>
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {engagementPaths.map((path) => (
              <article
                key={path.code}
                className={`group flex min-h-64 flex-col border p-6 transition hover:-translate-y-1 hover:border-[#D4AF37]/65 hover:shadow-[0_18px_45px_rgba(0,0,0,0.3)] ${
                  intent === path.intent ||
                  (isPilot && path.intent === "design-partner") ||
                  (isCommercial && path.intent === "commercial") ||
                  (isAudit && path.intent === "audit")
                    ? "border-[#D4AF37]/70 bg-[#152015]"
                    : "border-zinc-700/70 bg-[#101210]"
                }`}
              >
                <span className="font-mono text-xs tracking-[0.2em] text-[#D4AF37]">
                  PATH {path.code}
                </span>
                <h3 className="mt-6 text-xl font-semibold text-zinc-100">{path.title}</h3>
                <p className="mt-3 flex-1 text-sm leading-6 text-zinc-400">{path.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/contact/?intent=${path.intent}`}
                    className="text-sm font-semibold text-[#F2D675]"
                  >
                    Select path
                  </Link>
                  <a
                    href={inquiryHref(path.prompt)}
                    className="text-sm font-semibold text-zinc-400 transition group-hover:text-white"
                  >
                    {path.label} →
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="enquiry-form" className="relative mx-auto max-w-6xl scroll-mt-24 px-6 py-16 lg:px-8 lg:py-20">
        <EnquiryForm intent={intent} />
      </section>

      <section className="relative mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">
        <div className="grid gap-10 rounded-2xl border border-[#D4AF37]/25 bg-[linear-gradient(120deg,rgba(24,35,24,0.9),rgba(12,14,12,0.92))] p-7 sm:p-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              Preparation
            </p>
            <h2 className="mt-4 font-serif text-3xl leading-tight text-[#F2D675]">
              Bring the evidence horizon into view.
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="border-l border-[#D4AF37]/45 pl-5">
              <h3 className="text-sm font-semibold text-zinc-100">Decision boundary</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Describe the decision, constraint, or institutional responsibility that needs a
                durable control surface.
              </p>
            </div>
            <div className="border-l border-[#D4AF37]/45 pl-5">
              <h3 className="text-sm font-semibold text-zinc-100">Evidence requirements</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Note the records, replay requirements, or provenance expectations that should remain
                inspectable.
              </p>
            </div>
            <div className="border-l border-[#D4AF37]/45 pl-5">
              <h3 className="text-sm font-semibold text-zinc-100">System context</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Identify the human, agentic, and operational layers implicated by the inquiry.
              </p>
            </div>
            <div className="border-l border-[#D4AF37]/45 pl-5">
              <h3 className="text-sm font-semibold text-zinc-100">Desired next step</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                State whether you need a design partner pilot, architecture review, audit path, or
                research exchange.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col justify-between gap-6 border-t border-zinc-800 pt-8 sm:flex-row sm:items-center">
          <p className="max-w-2xl text-sm leading-6 text-zinc-400">
            For a complete public orientation before writing, review Limitations, Proof, Product,
            Pricing, and the pilot pathway.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm font-semibold text-[#F2D675]">
            <Link href="/limitations/" className="transition hover:text-white">
              Limitations
            </Link>
            <Link href="/proof/" className="transition hover:text-white">
              Proof
            </Link>
            <Link href="/product/" className="transition hover:text-white">
              Product
            </Link>
            <Link href="/pricing/" className="transition hover:text-white">
              Pricing
            </Link>
            <Link href="/institutional-pilots/" className="transition hover:text-white">
              Pilots
            </Link>
            <Link href="/observatory/" className="transition hover:text-white">
              Observatory
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default function ContactClient() {
  return (
    <Suspense
      fallback={
        <main className="bg-[#090a09] px-6 py-24 text-center text-zinc-400">
          Loading engagement desk…
        </main>
      }
    >
      <ContactBody />
    </Suspense>
  );
}
