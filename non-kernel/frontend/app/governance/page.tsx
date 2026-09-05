import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Governance — Constitutional controls",
  description:
    "Hub for Rasta Imperium governance: systems model, Seven Articles, Codex lineage, and verification surfaces.",
};

const links = [
  {
    href: "/governance-model/",
    title: "Governance model",
    body: "Systems properties: deterministic transitions, lineage, replay, constraints.",
  },
  {
    href: "/pillars/",
    title: "Seven Articles (Pillars)",
    body: "Containment through Temporal Asymmetry — with evidence status labels.",
  },
  {
    href: "/governance/codex/",
    title: "Codex index",
    body: "Article-level Codex entries and constitutional descriptions.",
  },
  {
    href: "/blueprint/",
    title: "Sovereign Blueprint",
    body: "L1–L9 stack from purpose to evidence, verification, and challenge.",
  },
  {
    href: "/proof/",
    title: "Proof Registry",
    body: "Sealed capsules and verified public artifacts.",
  },
  {
    href: "/limitations/",
    title: "Limitations",
    body: "Explicit unproven and unavailable claims on this surface.",
  },
];

export default function GovernancePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">Governance</p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Constitutional governance
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Constraints that make autonomous operation accountable: containment, observability,
            interruptibility, accountability, proportionality, reversibility, and temporal asymmetry —
            implemented as a systems model, not a policy PDF.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/governance-model/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Open governance model
            </Link>
            <Link
              href="/pillars/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Seven Articles
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="royal-panel block rounded-xl border p-5 transition hover:border-[#B8860B]/40"
            >
              <h2 className="text-base font-semibold text-[#F2D675]">{l.title}</h2>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{l.body}</p>
              <p className="mt-3 text-xs text-[#D4AF37]">Open →</p>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
