import type { Metadata } from "next";
import Link from "next/link";
import StatusBadge from "@/components/StatusBadge";

export const metadata: Metadata = {
  title: "Start Here — Rasta Imperium",
  description:
    "An orientation guide to Rasta Imperium's evidence, verification, system, constitutional doctrine, evaluation path, and limitations.",
};

const orientation = [
  {
    label: "Evidence / Library",
    title: "Inspect the evidence",
    body: "Explore the public Evidence Observatory and evidence records. Status and scope tell you what is established and what remains unavailable.",
    href: "/observatory/",
    cta: "Open Evidence Observatory",
  },
  {
    label: "Verify / Tools",
    title: "Check and reproduce",
    body: "Verification and reproduction are separate from presentation. Use the existing verification surface to inspect sealed artifacts and verifier pathways.",
    href: "/verify/",
    cta: "Open Verify",
  },
  {
    label: "System",
    title: "Understand the architecture",
    body: "Blueprint and architecture surfaces describe the nine-layer system, boundaries, and design intent. Architecture description does not by itself establish runtime evidence.",
    href: "/blueprint/",
    cta: "Open Blueprint",
  },
  {
    label: "Codex",
    title: "Read the constitutional doctrine",
    body: "The Codex expresses constitutional and civilizational design intent. It is not executable governance and does not establish verified L8 or L9 runtime control.",
    href: "/codex/",
    cta: "Open Codex",
  },
  {
    label: "Evaluate",
    title: "Follow the institutional path",
    body: "Use the evaluation surface to move from inspection and challenge through reproduction, assessment, crosswalk and bounded pilot discussion.",
    href: "/evaluate/",
    cta: "Open Evaluate",
  },
  {
    label: "Limitations",
    title: "See what is not proven",
    body: "Limitations make the evidence boundary explicit. Unproven does not mean false; it means the required sealed public evidence is not attached.",
    href: "/limitations/",
    cta: "Read Limitations",
  },
];

const publications = [
  ["Publication 1", "https://amzn.eu/d/03nJMcEw"],
  ["Publication 2", "https://amzn.eu/d/00whlgmi"],
  ["Publication 3", "https://amzn.eu/d/0aBZ5LZ7"],
  ["Publication 4", "https://amzn.eu/d/00SSYYhX"],
  ["Publication 5", "https://amzn.eu/d/03BWYPbI"],
] as const;

export default function StartHerePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Orientation · Evidence first
          </p>
          <h1 className="mt-5 max-w-4xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl lg:text-6xl">
            Do not trust the claim. Inspect the evidence.
          </h1>
          <p className="mt-6 max-w-3xl text-lg leading-8 text-zinc-300">
            New here? Start with the map below. Each surface has a different purpose, and the
            distinction between evidence, verification, architecture, doctrine and evaluation is intentional.
          </p>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
              Where should I go?
            </p>
            <h2 className="mt-3 font-cinzel text-2xl text-zinc-100 sm:text-3xl">Choose the surface for the question</h2>
          </div>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {orientation.map((item) => (
            <article key={item.href} className="royal-panel flex h-full flex-col rounded-xl border p-6">
              <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#D4AF37]">
                {item.label}
              </p>
              {item.label === "Codex" && (
                <span className="mt-3 inline-flex w-fit rounded-full border border-[#B8860B]/40 px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.16em] text-[#F2D675]">
                  Constitutional intent · non-executing
                </span>
              )}
              <h3 className="mt-3 font-cinzel text-xl text-zinc-100">{item.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-7 text-zinc-400">{item.body}</p>
              <Link href={item.href} className="mt-5 text-sm font-semibold text-[#F2D675] hover:underline">
                {item.cta} →
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">Evidence vocabulary</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Status and authority are not interchangeable</h2>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">
          The UI is not the authority. Inspect the sealed artifact and verifier. Constitutional intent is
          not the same thing as verified runtime evidence.
        </p>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <StatusBadge status="VERIFIED" />
            <p className="mt-3 text-sm leading-6 text-zinc-400">L3 is capsule-scoped; L7 evidence is VERIFIED and FROZEN.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <StatusBadge status="DEMONSTRATION" />
            <p className="mt-3 text-sm leading-6 text-zinc-400">Presentation or synthetic demonstrations are not production telemetry.</p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <StatusBadge status="UNAVAILABLE" />
            <p className="mt-3 text-sm leading-6 text-zinc-400">L8, L9 and LIVE telemetry remain unavailable on the public evidence surface.</p>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-[#B8860B]/25 bg-[#B8860B]/5 p-5">
          <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Production authority</p>
          <p className="mt-2 text-sm text-zinc-300">NOT ESTABLISHED</p>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">Institutional journey</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">From observation to a bounded decision</h2>
        <p className="mt-5 max-w-4xl text-sm leading-8 text-zinc-400">
          Observe → Inspect → Challenge → Verify → Reproduce → Assess → Crosswalk → Pilot → Decide
        </p>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-500">
          This is an orientation model. It does not imply that every stage is currently backed by live
          production evidence.
        </p>
      </section>

      <section className="container-page py-12 lg:py-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">Publications</p>
            <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Further reading</h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-zinc-500">
            Publications provide background and authored context. They are not substitutes for sealed evidence or independent verification.
          </p>
        </div>
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {publications.map(([label, href]) => (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="royal-panel rounded-xl border p-5 transition hover:border-[#B8860B]/40 hover:text-[#F2D675]"
            >
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">Publication</p>
              <p className="mt-2 text-sm font-semibold text-zinc-100">{label}</p>
              <p className="mt-2 text-xs text-zinc-500">Open on Amazon →</p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
