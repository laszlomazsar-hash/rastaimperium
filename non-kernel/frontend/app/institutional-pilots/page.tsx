import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Institutional Pilots — High-Accountability Environments",
  description:
    "Scoped pilot programs for regulated and high-accountability environments that require replay, traceability, and governance assurance before operational adoption.",
};

const focusAreas = [
  {
    title: "Regulated environments",
    body: "Settings where decisions must leave an inspectable trail and where retrospective explanation is not enough.",
  },
  {
    title: "Replay & traceability",
    body: "Pilots are designed so every consequential transition can be reconstructed and verified against policy.",
  },
  {
    title: "Governance assurance",
    body: "Constitutional constraints, capability boundaries, and human oversight paths are validated before scale-up.",
  },
];

export default function InstitutionalPilotsPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="container-page relative py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">Institutional Pilots</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Prove the system <span className="text-gold-gradient">before it scales.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Pilot programs are scoped for regulated and high-accountability environments where replay,
            traceability, and governance assurance are required before operational adoption.
          </p>
        </div>
      </section>

      <section className="container-page py-16 lg:py-20">
        <div className="grid gap-5 md:grid-cols-3">
          {focusAreas.map((f) => (
            <article key={f.title} className="panel p-6 sm:p-7">
              <h2 className="text-lg text-gold">{f.title}</h2>
              <p className="mt-3 text-sm leading-7 text-zinc-400">{f.body}</p>
            </article>
          ))}
        </div>

        <div className="mt-14 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <p className="text-zinc-300">Ready to discuss a scoped pilot?</p>
          <div className="mt-6 flex flex-wrap justify-center gap-4">
            <Link
              href="/contact"
              className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black transition hover:-translate-y-0.5 hover:bg-[#F2D675]"
            >
              Contact engagement desk
            </Link>
            <Link
              href="/consulting"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
            >
              Consulting & intake
            </Link>
            <Link
              href="/blueprint"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
            >
              Read the Blueprint
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
