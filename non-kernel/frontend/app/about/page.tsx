import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — Rasta Imperium",
  description:
    "Rasta Imperium is the public constitutional and verification layer for EVO-V. Founded by Laszlo Mazsar.",
};

export default function AboutPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">About</p>
          <h1 className="mt-5 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Constitutional intelligence, built in public.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Rasta Imperium is the public-facing constitutional, architecture, and verification layer
            for EVO-V — deterministic governance for autonomous systems that must remain
            reconstructible, challengeable, and bound by explicit rules.
          </p>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">Founder</p>
            <h2 className="mt-3 text-2xl text-zinc-100">Laszlo Mazsar</h2>
            <p className="mt-2 text-sm text-zinc-500">Founder & AI Systems Architect</p>
            <p className="mt-5 max-w-xl text-sm leading-7 text-zinc-300">
              I architect constitutional intelligence systems intended to enforce epistemic integrity
              across autonomous infrastructures — replayable decision history, illegal-transition
              rejection, and evidence that can be inspected independently of marketing claims.
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
            </div>
          </div>
          <aside className="rounded-xl border border-zinc-800 bg-black/30 p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
              What we ask you to trust
            </p>
            <ul className="mt-4 space-y-3 text-sm leading-6 text-zinc-400">
              <li>· Sealed public capsules you can re-run yourself</li>
              <li>· Explicit UNAVAILABLE labels where evidence is missing</li>
              <li>· A written pilot boundary before any commercial commitment</li>
              <li>· No anonymous case-study theatre without permission or proof</li>
            </ul>
            <Link href="/limitations/" className="mt-6 inline-block text-sm text-[#F2D675]">
              Limitations →
            </Link>
          </aside>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">Mission</p>
        <h2 className="mt-3 max-w-2xl text-2xl text-zinc-100">
          Make autonomous decisions reconstructible before they scale.
        </h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <h3 className="text-[#F2D675]">Verify</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Public proof registry, challenge lab, and auditor handoff paths.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <h3 className="text-[#F2D675]">Pilot</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Scoped design partner programs for regulated and high-accountability environments.
            </p>
          </div>
          <div className="rounded-xl border border-zinc-800 bg-black/30 p-5">
            <h3 className="text-[#F2D675]">Govern</h3>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Runtime and hosted modules remain a separate commercial layer — documented here, sold
              under explicit scope.
            </p>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="flex flex-col gap-6 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl text-zinc-100">Engage</h2>
            <p className="mt-2 max-w-lg text-sm text-zinc-400">
              Institutional pilots, research collaboration, or a commercial brief — start at Contact
              after Limitations and Proof.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/product/"
              className="rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Product pathway
            </Link>
            <Link
              href="/contact/"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Contact
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
