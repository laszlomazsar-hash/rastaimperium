import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies — Evidence before logos",
  description:
    "Methodology case studies from sealed public capsules, publication rules for institutional pilot outcomes, and the path from design partner pilot to publishable evidence. No fabricated logos or unverified metrics.",
};

export default function CaseStudiesPage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Case studies · social proof
          </p>
          <h1 className="mt-5 max-w-3xl font-cinzel text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Evidence before logos.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Institutional customer names and outcome metrics appear only with sealed public artifacts
            or explicit written permission. Until design partner results are publishable under those
            rules, this page carries methodology cases grounded in public capsules — not borrowed
            logos.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/institutional-pilots/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-3 text-sm font-bold text-black"
            >
              Become a design partner
            </Link>
            <Link
              href="/proof/"
              className="royal-button royal-button-ghost rounded-lg border border-[#B8860B]/40 px-5 py-3 text-sm text-[#F2D675]"
            >
              Public proof registry
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

      {/* Why this matters for buyers */}
      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          For institutional evaluators
        </p>
        <h2 className="mt-3 text-2xl text-zinc-100">What a case study must prove</h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Buyers evaluating deterministic governance need more than a slide with a logo. They need a
          reconstructible path: problem → method → sealed evidence → explicit boundary. The cases
          below follow that template using only public artifacts.
        </p>
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {[
            {
              title: "Problem",
              body: "A decision path that cannot be reconstructed or bounded creates liability.",
            },
            {
              title: "Method",
              body: "Freeze capsules, independent verifiers, written success criteria.",
            },
            {
              title: "Boundary",
              body: "Capsule-scoped claims only. Unproven metrics stay UNAVAILABLE.",
            },
          ].map((c) => (
            <div key={c.title} className="royal-panel rounded-xl border p-5">
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">{c.title}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">{c.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CS-001 */}
      <section className="container-page border-b border-zinc-900 py-14" aria-labelledby="method-case">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
            CS-001 · methodology
          </p>
          <span className="rounded border border-emerald-900/50 bg-emerald-950/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-emerald-200/90">
            PUBLIC CAPSULES · VERIFIED
          </span>
        </div>
        <h2 id="method-case" className="mt-3 font-cinzel text-2xl text-zinc-100 sm:text-3xl">
          Sealed replay & illegal-transition rejection
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          Not a customer logo story. A worked example of how EVO-V evidence is expected to look when
          a high-stakes decision path must remain reconstructible and bounded.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="royal-panel rounded-xl border p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">01 · Problem</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Autonomous or semi-autonomous systems change state in ways operators cannot later
              reconstruct: which rule applied, whether an illegal transition was attempted, and
              whether the audit trail still matches live memory.
            </p>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">02 · Approach</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Freeze public capsules for deterministic replay parity and illegal lifecycle rejection.
              Independent Node and Python verifiers must exit 0 on the same sealed hashes — or the
              claim is not labelled VERIFIED.
            </p>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">03 · Evidence</p>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-zinc-300">
              <li>
                <Link href="/proof/" className="text-[#F2D675] hover:underline">
                  ART-L7-REPLAY-001
                </Link>{" "}
                — deterministic replay parity (VERIFIED)
              </li>
              <li>
                <Link href="/proof/" className="text-[#F2D675] hover:underline">
                  ART-L7-REJECT-001
                </Link>{" "}
                — illegal transition rejection (VERIFIED)
              </li>
              <li>
                <Link href="/proof/" className="text-[#F2D675] hover:underline">
                  ART-L7-PARITY-001
                </Link>{" "}
                — cross-runtime parity (VERIFIED)
              </li>
            </ul>
          </div>
          <div className="royal-panel rounded-xl border p-6">
            <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">04 · Boundary</p>
            <p className="mt-3 text-sm leading-7 text-zinc-300">
              Capsule-scoped only. No claim that production fleets, latency, or reliability figures
              are verified. Performance numbers remain UNAVAILABLE until sealed benchmark artifacts
              exist. See{" "}
              <Link href="/limitations/" className="text-[#F2D675] hover:underline">
                Limitations
              </Link>
              .
            </p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            Outcome for evaluators
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-zinc-400">
            An auditor or institutional buyer can clone the verification scripts, re-run them, and
            confirm or falsify the VERIFIED label without trusting marketing copy. That is the
            pattern design partner pilots extend to a customer stack: written scope, sealed or
            customer-held artifacts, explicit non-goals.
          </p>
          <div className="mt-5 flex flex-wrap gap-4 text-sm">
            <Link href="/proof/" className="font-semibold text-[#F2D675]">
              Open Proof Registry →
            </Link>
            <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">
              Challenge Lab →
            </Link>
            <Link href="/evidence/" className="text-zinc-400 hover:text-[#F2D675]">
              Evidence Explorer →
            </Link>
          </div>
        </div>
      </section>

      {/* CS-002 — pilot narrative template */}
      <section className="container-page border-b border-zinc-900 py-14" aria-labelledby="pilot-template">
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
            CS-002 · pilot narrative template
          </p>
          <span className="rounded border border-violet-900/50 bg-violet-950/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violet-200/90">
            TARGET · FRAMEWORK
          </span>
        </div>
        <h2 id="pilot-template" className="mt-3 font-cinzel text-2xl text-zinc-100 sm:text-3xl">
          How a design partner case will be written
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
          When the first institutional pilot is ready for publication, it will follow this structure.
          Nothing below is a claim about a current customer.
        </p>

        <ol className="mt-10 space-y-4">
          {[
            {
              step: "01",
              title: "Context",
              body: "Sector, decision class, and why reconstructibility or bound-enforcement matters (no confidential detail without permission).",
            },
            {
              step: "02",
              title: "Scope",
              body: "Written pilot boundary: which agent paths, which invariants, which systems, and what is explicitly out of scope.",
            },
            {
              step: "03",
              title: "Success criteria",
              body: "Pre-agreed pass/fail conditions — not post-hoc storytelling.",
            },
            {
              step: "04",
              title: "Evidence",
              body: "Public capsules and/or customer-held artifacts with verification method. Provenance labels on every claim.",
            },
            {
              step: "05",
              title: "Outcomes & non-outcomes",
              body: "What was demonstrated, what remains UNAVAILABLE, and recommended next step (scale, hold, or re-scope).",
            },
          ].map((item) => (
            <li
              key={item.step}
              className="flex gap-4 rounded-xl border border-zinc-800 bg-black/30 p-5"
            >
              <span className="font-mono text-sm text-[#D4AF37]">{item.step}</span>
              <div>
                <p className="font-semibold text-zinc-100">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-zinc-400">{item.body}</p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/institutional-pilots/"
            className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black"
          >
            Design partner pathway
          </Link>
          <Link
            href="/contact/?intent=design-partner"
            className="rounded-lg border border-[#B8860B]/40 px-5 py-2.5 text-sm text-[#F2D675]"
          >
            Apply for pilot
          </Link>
        </div>
      </section>

      {/* Publication standard */}
      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Publication standard
        </p>
        <h2 className="mt-3 text-2xl text-zinc-100">What must be true before a named case appears</h2>
        <ul className="mt-6 max-w-2xl space-y-3 text-sm leading-7 text-zinc-400">
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>Named organisation permission, or fully anonymised framing agreed in writing</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>Pilot scope, success criteria, and non-goals documented</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>Claims tied to evidence (public capsules or customer-held artifacts)</span>
          </li>
          <li className="flex gap-2">
            <span className="text-[#B8860B]">·</span>
            <span>No performance or reliability figures labelled VERIFIED without sealed provenance</span>
          </li>
        </ul>
      </section>

      {/* Named cases status */}
      <section className="container-page border-b border-zinc-900 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#B8860B]">
          Institutional cases
        </p>
        <div className="mt-6 rounded-xl border border-zinc-800 bg-black/30 p-6">
          <p className="font-mono text-[11px] uppercase tracking-wider text-[#D4AF37]">
            UNAVAILABLE · no published named institutional case studies
          </p>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-400">
            Design partner pilots are open. The first publishable named cases will appear here after
            written permission and evidence review. Until then, evaluate via Proof, Challenge, and
            the methodology case above.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="container-page py-14">
        <div className="rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-8 text-center">
          <h2 className="font-cinzel text-2xl text-zinc-100">Pilot first. Publish later.</h2>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-zinc-400">
            If you want a governed pilot and may allow a future case study under the rules above,
            start the design partner path.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link
              href="/contact/?intent=design-partner"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black"
            >
              Apply · design partner
            </Link>
            <Link
              href="/institutional-pilots/"
              className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]"
            >
              Pilot pathway detail
            </Link>
            <Link
              href="/product/"
              className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100"
            >
              Product pathway
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
