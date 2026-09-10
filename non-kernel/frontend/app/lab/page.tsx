import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lab — Experiments & controlled previews | Rasta Imperium",
  description:
    "Canonical lab surface for experiments, demonstrations, and controlled previews. Production claims stay separated until verification paths are defined.",
};

export default function LabPage() {
  return (
    <main className="royal-page">
      <section className="border-b border-[rgba(242,214,117,0.18)]">
        <div className="container-page py-14 sm:py-16">
          <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
            Lab · exploratory surface
          </p>
          <h1 className="royal-title mt-4 max-w-3xl text-4xl leading-[1.08] text-zinc-50 sm:text-5xl">
            Experiments stay labelled until evidence exists.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-300">
            The lab is the canonical surface for experiments, demonstrations, and controlled
            previews. Production claims remain separated from exploratory work until verification
            paths are defined.
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
            Nothing here upgrades a claim to VERIFIED. Sealed public capsules live under Proof and
            Verify; unavailable claims stay labelled on Limitations.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm">
            <Link
              href="/challenge/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 font-bold text-black transition hover:bg-[#F2D675]"
            >
              Challenge Lab
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/50 px-5 py-2.5 font-semibold text-[#F2D675] transition hover:bg-[#B8860B]/10"
            >
              Proof Registry
            </Link>
            <Link href="/limitations/" className="px-2 py-2.5 text-zinc-500 transition hover:text-[#F2D675]">
              Limitations →
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
