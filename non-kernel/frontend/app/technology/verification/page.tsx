import type { Metadata } from "next";

export const metadata: Metadata = { title: "Verification — EVO-V Technology", description: "Replay and verification path for EVO-V governed systems." };

const checks = ["Replay parity", "Audit completeness", "Snapshot determinism", "Ordering integrity", "Lineage consistency"];

export default function VerificationPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Technology / Verification</p>
      <h1 className="mt-4 text-4xl font-bold">Verification path</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        Verification focuses on proving that reconstructed state is pure, deterministic, and complete.
        Critical failures preserve counterexample artifacts rather than silently repairing history.
      </p>
      <section className="mt-8 grid gap-3">
        {checks.map((check) => (
          <div key={check} className="rounded-lg border border-zinc-800 p-4 text-zinc-200">{check}</div>
        ))}
      </section>
    </main>
  );
}
