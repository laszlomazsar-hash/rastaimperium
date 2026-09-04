"use client";

import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            About
          </p>
          <h1 className="mt-4 max-w-3xl text-4xl text-zinc-100 sm:text-5xl">Rasta Imperium</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            Public constitutional and verification layer for EVO-V — deterministic governance for
            civilization-scale AI.
          </p>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="max-w-2xl space-y-6 text-sm leading-7 text-zinc-300">
          <p>
            Rasta Imperium is the public-facing constitutional, architecture, and verification surface
            for EVO-V. It is not the execution runtime. Every high-value claim is bound to a proof,
            sealed artifact, or explicit UNAVAILABLE label.
          </p>
          <p>
            The work is led by Laszlo Mazsar — systems architect building constitutional infrastructure
            for distributed cognition and creator of the EVO-V Governance OS lineage.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm">
            <a
              href="https://www.linkedin.com/in/laszlo-mazsar-97744aa4"
              target="_blank"
              rel="noreferrer"
              className="text-[#F2D675]"
            >
              LinkedIn →
            </a>
            <a
              href="https://x.com/mazsarlaszlo"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400"
            >
              X →
            </a>
            <a
              href="https://github.com/laszlomazsar-hash"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400"
            >
              GitHub →
            </a>
            <a
              href="https://substack.com/@codexbylaszlo"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400"
            >
              Substack →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
