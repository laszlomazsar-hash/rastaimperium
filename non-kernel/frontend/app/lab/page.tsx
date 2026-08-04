import type { Metadata } from "next";

export const metadata: Metadata = { title: "Lab — Rastafarai", description: "Canonical lab route for experiments and demonstrations." };

export default function LabPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#B8860B]">Lab</p>
      <h1 className="mt-4 text-4xl font-bold">Lab</h1>
      <p className="mt-6 text-zinc-300 leading-8">
        The lab is the canonical surface for experiments, demonstrations, and controlled previews.
        Production claims remain separated from exploratory work until verification paths are defined.
      </p>
    </main>
  );
}
