import type { Metadata } from "next";
import Link from "next/link";
import { ProvenanceBadge, VerificationBadge } from "../../components/evidence/ProvenanceBadge";
import { TrustStatus } from "../../components/evidence/TrustStatus";
import { ClaimEvidence } from "../../components/evidence/ClaimEvidence";

export const metadata: Metadata = {
  title: "Design System — Rasta Royal",
  description:
    "Living style guide for the Rasta Royal visual system: color, typography, panels, badges, buttons, and evidence components. Dignified, ceremonial, evidence-led.",
};

const colorSwatches = [
  { name: "Rasta Red", hex: "#e01e1e", token: "--rasta-red" },
  { name: "Rasta Gold", hex: "#ffcc00", token: "--rasta-gold" },
  { name: "Rasta Green", hex: "#107e3e", token: "--rasta-green" },
  { name: "Deep Earth", hex: "#0a0a0a", token: "--deep-earth" },
  { name: "Royal Gold", hex: "#f2d675", token: "--royal-gold" },
  { name: "Royal Gold Deep", hex: "#b88718", token: "--royal-gold-deep" },
  { name: "Royal Green", hex: "#1e8a4b", token: "--royal-green" },
  { name: "Royal Red", hex: "#a92d2d", token: "--royal-red" },
  { name: "Royal Ink", hex: "#070807", token: "--royal-ink" },
];

export default function DesignSystemPage() {
  return (
    <main className="royal-page overflow-hidden">
      {/* Hero */}
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Design system · living guide
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Rasta Royal
            <span className="mt-2 block text-gold-gradient">Visual language</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Dignified, ceremonial, and evidence-led. Every visual choice serves the core message:
            do not trust the claim — inspect the evidence.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#colors"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Explore tokens
            </a>
            <Link
              href="/library/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Library
            </Link>
            <a
              href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/non-kernel/frontend/docs/rasta-royal-design-system.md"
              target="_blank"
              rel="noreferrer"
              className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100"
            >
              Implementation docs →
            </a>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section id="colors" className="container-page border-b border-zinc-900 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">01 · Color</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Palette</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Rasta Trinity plus Royal derivatives. Used for brand, status, and atmospheric depth.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-5">
          {colorSwatches.map((c) => (
            <div key={c.token} className="royal-panel rounded-xl border p-3">
              <div
                className="h-16 w-full rounded-lg border border-zinc-800"
                style={{ backgroundColor: c.hex }}
              />
              <p className="mt-3 text-sm font-medium text-zinc-100">{c.name}</p>
              <p className="mt-0.5 font-mono text-[11px] text-zinc-500">{c.hex}</p>
              <p className="mt-0.5 font-mono text-[10px] text-zinc-600">{c.token}</p>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
            Signature gradient
          </p>
          <p className="mt-3 text-3xl font-cinzel">
            <span className="text-gold-gradient">Green → Gold → Red</span>
          </p>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            className=&quot;text-gold-gradient&quot;
          </p>
        </div>
      </section>

      {/* Typography */}
      <section id="typography" className="container-page border-b border-zinc-900 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">02 · Typography</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Type scale</h2>
        <div className="mt-8 space-y-8">
          <div className="royal-panel rounded-xl border p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Cinzel — Display</p>
            <p className="mt-2 font-cinzel text-4xl text-zinc-50">Do not trust the claim.</p>
            <p className="mt-1 font-mono text-xs text-zinc-600">font-cinzel · headings</p>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Raleway — Body</p>
            <p className="mt-2 text-base leading-7 text-zinc-300">
              Rasta Imperium is the verification surface for deterministic AI governance — not the
              execution runtime. Sealed capsules, explicit Limitations, and design partner pilots.
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-600">font-raleway · body / UI</p>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Courier New — Evidence</p>
            <p className="mt-2 font-mono text-sm text-zinc-200">
              ART-L7-REPLAY-001 · INV-001 · hash 0fe2…cdd9
            </p>
            <p className="mt-1 font-mono text-xs text-zinc-600">font-courier · hashes / telemetry</p>
          </div>
        </div>
      </section>

      {/* Panels & Seals */}
      <section id="panels" className="container-page border-b border-zinc-900 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">03 · Surfaces</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Panels & seals</h2>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <div className="royal-panel rounded-xl border p-6">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              .royal-panel
            </p>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              Glass-morphism with gold border, inset highlight, and deep shadow. Hover brightens the
              border and deepens the glow.
            </p>
          </div>
          <div className="flex items-center justify-center rounded-xl border border-zinc-800 bg-black/30 p-8">
            <div className="royal-seal-wrap">
              <div className="rounded-lg border border-[rgba(242,214,117,0.3)] bg-black/40 px-4 py-3 text-center">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]">
                  Trust status
                </p>
                <p className="mt-1 font-mono text-sm text-zinc-100">OPERATIONAL</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges */}
      <section id="badges" className="container-page border-b border-zinc-900 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">04 · Evidence badges</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Status vocabulary</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Semantic colors for claim provenance and verification. Monospace, uppercase, tight tracking.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <VerificationBadge status="VERIFIED" />
          <ProvenanceBadge kind="DEMONSTRATION" />
          <ProvenanceBadge kind="HISTORICAL" />
          <ProvenanceBadge kind="TARGET" />
          <ProvenanceBadge kind="UNAVAILABLE" />
          <ProvenanceBadge kind="LIVE" />
        </div>
        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[520px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500">
                <th className="py-2 pr-4">Status</th>
                <th className="py-2">Meaning</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 pr-4"><VerificationBadge status="VERIFIED" /></td>
                <td>Independently reproducible</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 pr-4"><ProvenanceBadge kind="DEMONSTRATION" /></td>
                <td>Synthetic / illustrative</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 pr-4"><ProvenanceBadge kind="HISTORICAL" /></td>
                <td>Past artifact, not current LIVE</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 pr-4"><ProvenanceBadge kind="TARGET" /></td>
                <td>Aspiration / roadmap</td>
              </tr>
              <tr className="border-b border-zinc-900">
                <td className="py-2.5 pr-4"><ProvenanceBadge kind="UNAVAILABLE" /></td>
                <td>Explicitly unproven</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Buttons */}
      <section id="buttons" className="container-page border-b border-zinc-900 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">05 · Buttons</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Actions with shimmer</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Primary and ghost variants. Hover triggers a diagonal light sweep (sovereign wipe).
        </p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link
            href="/institutional-pilots/"
            className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
          >
            Pilot with us
          </Link>
          <Link
            href="/limitations/"
            className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
          >
            Read Limitations first
          </Link>
          <Link
            href="/contact/"
            className="rounded-lg border border-zinc-600 px-5 py-3 text-sm text-zinc-100 transition hover:border-[#B8860B]/40"
          >
            Contact
          </Link>
        </div>
      </section>

      {/* Live components */}
      <section id="components" className="container-page border-b border-zinc-900 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">06 · Live components</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Evidence surfaces</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Real components rendered with production data and styling.
        </p>

        <div className="mt-10 space-y-10">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              TrustStatus (compact)
            </p>
            <TrustStatus compact />
          </div>

          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#B8860B]">
              ClaimEvidence
            </p>
            <div className="grid gap-4 lg:grid-cols-2">
              <ClaimEvidence claimId="CLAIM-REPLAY-001" />
              <ClaimEvidence claimId="CLAIM-LIFECYCLE-001" />
            </div>
          </div>
        </div>
      </section>

      {/* Atmosphere */}
      <section id="atmosphere" className="container-page border-b border-zinc-900 py-14">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">07 · Atmosphere</p>
        <h2 className="mt-3 font-cinzel text-2xl text-zinc-100">Background layers</h2>
        <ul className="mt-6 space-y-3 text-sm text-zinc-400">
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>
              <strong className="text-zinc-200">Seed of Life</strong> — rotating SVG sacred geometry
              at low gold opacity (180s cycle)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>
              <strong className="text-zinc-200">Ambient glow</strong> — centered radial pulse (8s)
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>
              <strong className="text-zinc-200">Body radials</strong> — green / gold / red blurs for
              living depth
            </span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>
              All motion respects <code className="font-mono text-xs text-zinc-300">prefers-reduced-motion</code>
            </span>
          </li>
        </ul>
      </section>

      {/* CTA */}
      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Implementation reference</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            Full code snippets, class cheatsheet, and usage patterns live in the repository docs.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href="https://github.com/laszlomazsar-hash/rastaimperium/blob/main/non-kernel/frontend/docs/rasta-royal-design-system.md"
              target="_blank"
              rel="noreferrer"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Open implementation docs
            </a>
            <Link
              href="/library/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Library
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
