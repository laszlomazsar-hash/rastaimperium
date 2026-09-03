import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Invest & Support — Rasta Imperium",
  description:
    "Support sovereign AI infrastructure. Community contributions and institutional engagement paths for EVO-V constitutional governance.",
};

const funding = [
  {
    title: "Infrastructure",
    body: "Hosting, domains, CI, and tooling for the public verification surface and related repositories.",
  },
  {
    title: "Research & development",
    body: "Deterministic governance, replay/evidence work, and kernel / Observatory productisation under explicit scope.",
  },
  {
    title: "Publications & outreach",
    body: "Codex materials, design documents, and community-facing education — not a substitute for sealed proof.",
  },
];

export default function InvestPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 text-center lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Invest & support
          </p>
          <h1 className="mt-5 text-4xl text-zinc-100 sm:text-5xl">Invest in sovereignty</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Support the public constitutional layer and the path toward deterministic governance.
            Community contributions and institutional engagement are separate channels — both
            evidence-bound.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/product/"
              className="rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Institutional product path
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Proof Registry
            </Link>
            <Link
              href="/limitations/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Limitations
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <h2 className="text-2xl text-zinc-100">What support funds</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {funding.map((f) => (
            <div key={f.title} className="rounded-xl border border-zinc-800 bg-black/30 p-6">
              <h3 className="text-lg text-[#F2D675]">{f.title}</h3>
              <p className="mt-3 text-sm leading-6 text-zinc-400">{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-xl border border-[#B8860B]/30 bg-black/30 p-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
              Community · direct transfer
            </p>
            <h2 className="mt-3 text-2xl text-zinc-100">Bank transfer (UK)</h2>
            <p className="mt-2 text-sm text-zinc-500">Santander UK · personal account of Laszlo Mazsar</p>
            <dl className="mt-6 space-y-3 font-mono text-sm">
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <dt className="text-zinc-500">Account name</dt>
                <dd className="text-zinc-100">Laszlo Mazsar</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <dt className="text-zinc-500">Sort code</dt>
                <dd className="text-zinc-100">09-01-28</dd>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-2">
                <dt className="text-zinc-500">Account number</dt>
                <dd className="text-zinc-100">30627007</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-zinc-500">Reference</dt>
                <dd className="text-[#F2D675]">EVO-V-INVEST</dd>
              </div>
            </dl>
            <p className="mt-6 text-xs leading-5 text-zinc-500">
              Contributions are voluntary support for public work. This is not a securities offering
              and not a claim of verified financial return.
            </p>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-black/30 p-8">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
              Institutional · commercial
            </p>
            <h2 className="mt-3 text-2xl text-zinc-100">Design partners & enterprise</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-400">
              For councils, regulated teams, and enterprise buyers: paid pilots, audit paths, and
              runtime modules under written scope. Start with Product and Pricing posture — not a
              donation form.
            </p>
            <ul className="mt-5 space-y-2 text-sm text-zinc-400">
              <li>· Design partner pilot · indicative $50k–$150k</li>
              <li>· Governance audit path · scoped quote</li>
              <li>· Runtime & Observatory · enterprise terms after pilot</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/pricing/"
                className="rounded-lg bg-[#D4AF37] px-4 py-2 text-sm font-bold text-black"
              >
                Pricing posture
              </Link>
              <Link
                href="/contact/?intent=commercial"
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-100"
              >
                Commercial brief
              </Link>
              <Link
                href="/institutional-pilots/"
                className="rounded-lg border border-zinc-600 px-4 py-2 text-sm text-zinc-100"
              >
                Pilots
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <h2 className="text-center text-2xl text-zinc-100">Other ways to support</h2>
        <div className="mx-auto mt-8 grid max-w-2xl gap-4 sm:grid-cols-2">
          <a
            href="https://mazsar.gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-center transition hover:border-[#B8860B]/40"
          >
            <p className="font-semibold text-[#F2D675]">Digital products</p>
            <p className="mt-2 text-sm text-zinc-500">mazsar.gumroad.com</p>
          </a>
          <a
            href="https://www.amazon.co.uk/stores/Laszlo-Mazsar/author/B0DT3YJKQH"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-xl border border-zinc-800 bg-black/30 p-6 text-center transition hover:border-[#B8860B]/40"
          >
            <p className="font-semibold text-[#F2D675]">Books</p>
            <p className="mt-2 text-sm text-zinc-500">Amazon author page</p>
          </a>
        </div>

        <blockquote className="mx-auto mt-12 max-w-2xl rounded-xl border border-[#B8860B]/25 bg-black/20 p-8 text-center">
          <p className="text-sm italic leading-7 text-zinc-300">
            “We are building the constitutional physics for autonomous intelligence. Not to control
            AI, but to ensure it governs itself with the same integrity we demand of sovereign
            nations. This is not charity — this is infrastructure for the future.”
          </p>
          <p className="mt-4 text-xs tracking-widest text-[#D4AF37]">— LASZLO MAZSAR</p>
        </blockquote>

        <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm">
          <Link href="/library/" className="text-[#F2D675]">
            Library →
          </Link>
          <Link href="/applications/" className="text-zinc-400">
            Applications →
          </Link>
          <Link href="/observatory/" className="text-zinc-400">
            Observatory demo →
          </Link>
        </div>
      </section>
    </main>
  );
}
