import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Rasta Imperium — Deterministic AI governance you can verify",
  description:
    "Do not trust the claim. Inspect the evidence. Deterministic governance for systems whose decisions must remain reconstructible, inspectable and accountable.",
};

export default function HomePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[rgba(242,214,117,0.2)]">
        <div className="container-page py-14 lg:py-20">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Rasta Imperium
          </p>
          <h1 className="mt-4 max-w-3xl font-cinzel text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Do not trust the claim.{" "}
            <span className="mt-1 block text-[#F2D675]">Inspect the evidence.</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-zinc-300">
            Deterministic governance for systems whose decisions must remain reconstructible,
            inspectable and accountable. Inspect sealed L7 capsules. Reproduce offline. No opaque
            autonomy.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/verify/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Verify the evidence
            </Link>
            <Link
              href="/observatory/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Evidence Observatory
            </Link>
            <Link
              href="/evaluate/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Evaluate
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-zinc-900/80">
        <div className="container-page py-12">
          <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d4af37]">
            Institutional path
          </p>
          <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Evidence → evaluation → conversation</h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            For organisations that need reconstructible governance on a defined subset of their stack.
            Scope and success criteria are written before any claim of operational adoption. Evidence
            first; commercial engagement only after Limitations are read.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/verify/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:bg-[#F2D675]"
            >
              Verify the evidence
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm font-semibold text-[#F2D675] transition hover:border-[#F2D675]"
            >
              Evaluate a pilot pathway
            </Link>
            <Link
              href="/contact/?intent=institutional"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70"
            >
              Contact Rasta Imperium
            </Link>
            <Link
              href="/limitations/"
              className="text-sm text-zinc-500 transition hover:text-[#F2D675]"
            >
              Read Limitations first →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
