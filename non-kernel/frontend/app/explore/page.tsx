import type { Metadata } from "next";
import Link from "next/link";
import { DISCOVERY_GROUPS, type DiscoveryLevel } from "../../data/discovery";

export const metadata: Metadata = {
  title: "Explore — Atlas of Rasta Imperium",
  description:
    "Secondary discovery atlas for the full public body of work: civilization, system, applications, knowledge, evidence, and institutional paths. Existing routes preserved.",
  openGraph: {
    title: "Explore — Atlas of Rasta Imperium",
    description:
      "Clean primary shell; deep civilization. Navigate Applications, Thanks & Praise, Library, Research, Architecture, and more without losing content.",
    url: "https://rastaimperium.com/explore/",
  },
};

function levelLabel(level: DiscoveryLevel): string {
  if (level === "primary") return "Core journey";
  if (level === "secondary") return "Supporting";
  return "Archive";
}

export default function ExplorePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[rgba(242,214,117,0.18)]">
        <div className="container-page py-12 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Public atlas · secondary discovery
          </p>
          <h1 className="royal-title mt-4 max-w-3xl text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Explore
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-300 sm:text-lg">
            The primary navigation stays focused. This atlas maps the wider public body of work —
            civilization narrative, system documentation, applications, knowledge, evidence, and
            institutional paths — without removing existing routes.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-500">
            Hierarchy: Core journey · Supporting · Archive. Prefer sealed evidence on Proof and
            Verify for verification claims.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/applications/"
              className="rounded-md border border-[#B8860B]/50 bg-[#B8860B]/10 px-4 py-2.5 text-sm font-medium text-[#F2D675] transition hover:bg-[#B8860B]/20"
            >
              Applications
            </Link>
            <Link
              href="/thanks-and-praise/"
              className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 transition hover:border-[#B8860B]/40 hover:text-[#F2D675]"
            >
              Thanks &amp; Praise
            </Link>
            <Link
              href="/case-studies/"
              className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 transition hover:border-[#B8860B]/40 hover:text-[#F2D675]"
            >
              Case studies
            </Link>
            <Link
              href="/library/"
              className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 transition hover:border-[#B8860B]/40 hover:text-[#F2D675]"
            >
              Library
            </Link>
            <Link
              href="/proof/"
              className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm text-zinc-200 transition hover:border-[#B8860B]/40 hover:text-[#F2D675]"
            >
              Proof Registry
            </Link>
          </div>
        </div>
      </section>

      <div className="container-page space-y-14 py-12 sm:py-16">
        {DISCOVERY_GROUPS.map((group) => (
          <section key={group.id} aria-labelledby={`explore-${group.id}`}>
            <div className="border-b border-zinc-800/80 pb-3">
              <h2
                id={`explore-${group.id}`}
                className="font-cinzel text-2xl tracking-wide text-[#F2D675] sm:text-3xl"
              >
                {group.label}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">{group.summary}</p>
            </div>
            <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {group.entries.map((entry) => (
                <li key={entry.href}>
                  <Link
                    href={entry.href}
                    className="block rounded-lg border border-zinc-800/90 bg-[#0c0d0c] p-4 transition hover:border-[#B8860B]/35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#F2D675]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-base font-medium text-zinc-100">{entry.title}</span>
                      <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.14em] text-zinc-500">
                        {levelLabel(entry.level)}
                      </span>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-zinc-500">{entry.description}</p>
                    <p className="mt-3 font-mono text-[10px] text-zinc-600">{entry.href}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-xl border border-zinc-800 bg-black/25 p-6 sm:p-8">
          <h2 className="font-cinzel text-xl text-[#F2D675]">Preservation note</h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            This page is a discovery layer only. It does not replace individual routes. Public URLs
            remain stable. Utility and internal surfaces (for example design-system and dashboards)
            stay out of the primary narrative unless linked from their own contexts.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <Link href="/proof/" className="text-[#F2D675] hover:underline">
              Proof Registry →
            </Link>
            <Link href="/limitations/" className="text-zinc-400 hover:text-[#F2D675]">
              Limitations →
            </Link>
            <Link href="/" className="text-zinc-400 hover:text-[#F2D675]">
              Imperium home →
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
