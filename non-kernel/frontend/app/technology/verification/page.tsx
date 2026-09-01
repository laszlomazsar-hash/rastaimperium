import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Verification — EVO-V Technology",
  description: "Replay and verification path for EVO-V governed systems — linked to the public Trust and Proof surfaces.",
};

const checks = [
  { name: "Replay parity", href: "/proof#PROOF-REPLAY-001" },
  { name: "Audit completeness", href: "/evidence" },
  { name: "Snapshot determinism", href: "/proof" },
  { name: "Ordering integrity", href: "/challenge" },
  { name: "Lineage consistency", href: "/proof#PROOF-CHAIN-001" },
];

export default function VerificationPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Technology / Verification</p>
      <h1 className="mt-4 text-4xl font-bold">Verification path</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        Verification focuses on proving that reconstructed state is pure, deterministic, and complete.
        Critical failures preserve counterexample artifacts rather than silently repairing history.
        Public inspection lives on the Trust Console, Proof Registry, Evidence Explorer, and Challenge Lab.
      </p>
      <section className="mt-8 grid gap-3">
        {checks.map((check) => (
          <Link
            key={check.name}
            href={check.href}
            className="rounded-lg border border-zinc-800 p-4 text-zinc-200 transition hover:border-[#B8860B]/40 hover:text-[#F2D675]"
          >
            {check.name}
          </Link>
        ))}
      </section>
      <div className="mt-10 flex flex-wrap gap-3">
        <Link href="/trust" className="rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-semibold text-black">
          Trust Console
        </Link>
        <Link href="/challenge" className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100">
          Challenge Lab
        </Link>
      </div>
    </main>
  );
}
