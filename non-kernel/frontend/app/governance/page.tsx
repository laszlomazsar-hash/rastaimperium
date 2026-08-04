import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Governance — Rastafarai", description: "Canonical governance overview for constitutional controls and Codex lineage." };

export default function GovernancePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Governance</p>
      <h1 className="mt-4 text-4xl font-bold">Constitutional governance</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        Governance defines the constraints that make autonomous operation accountable: containment,
        observability, interruptibility, accountability, proportionality, reversibility, and temporal
        asymmetry.
      </p>
      <Link href="/governance/codex" className="mt-8 inline-block rounded-md bg-[#B8860B] px-5 py-3 font-bold text-black hover:bg-yellow-700">Read the Codex</Link>
    </main>
  );
}
