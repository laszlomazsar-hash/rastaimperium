import type { Metadata } from "next";
import Link from "next/link";
import EvidenceJourneyNav from "@/components/EvidenceJourneyNav";

export const metadata: Metadata = {
  title: "Limitations — What AI governance claims we have not proven",
  description:
    "Explicit list of unproven and UNAVAILABLE claims for Rasta Imperium public evidence. Performance benchmarks, production telemetry, and certification language require sealed artifacts. Unproven does not mean false.",
  keywords: [
    "AI governance limitations",
    "unproven claims",
    "evidence-bound AI",
    "deterministic AI transparency",
  ],
  openGraph: {
    title: "Limitations — Honest boundary of public evidence",
    description:
      "Honest boundary of the public verification surface. Inspect what is VERIFIED, DEMONSTRATION, and UNAVAILABLE before institutional evaluation.",
    url: "https://rastaimperium.com/limitations/",
  },
};

const boundaries = [
  {
    label: "UNAVAILABLE · performance benchmarks",
    body: "Ops/sec, latency, human approval rate, and reliability figures are not VERIFIED without sealed public benchmark capsules.",
  },
  {
    label: "UNAVAILABLE · production LIVE telemetry",
    body: "No public sealed live agent or fleet telemetry is published on this surface. Synthetic Observatory panels are DEMONSTRATION only.",
  },
  {
    label: "UNAVAILABLE · full EVO-V kernel parity",
    body: "Public pure-verifier agreement on L7 capsules is not equivalent to full-kernel production parity or continuous runtime health.",
  },
  {
    label: "UNAVAILABLE · regulatory certification",
    body: "No certification, regulatory approval, or court-ready assurance language is claimed from the public baseline.",
  },
  {
    label: "Scope · capsule-only VERIFIED",
    body: "ART-L7-REPLAY-001, ART-L7-REJECT-001, and ART-L7-PARITY-001 are VERIFIED only within sealed public capsule scope. ART-L7-PARITY-002 remains historical and outside the current Living Evidence Manifest VERIFIED set.",
  },
  {
    label: "UI is presentation",
    body: "Website cards and journey navigation do not establish truth. Offline pure verifiers and sealed artifacts remain authoritative.",
  },
] as const;

export default function LimitationsPage() {
  return (
    <main className="royal-page overflow-hidden">
      <EvidenceJourneyNav />
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-16 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">
            Honesty boundary
          </p>
          <h1 className="mt-4 font-cinzel text-4xl text-zinc-100 sm:text-5xl">
            What we have not proven
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-zinc-400">
            VERIFIED means the declared verification conditions were satisfied within the stated
            scope. It does not mean universal correctness, production health, or certification.
            Unproven does not mean false — it means the public record does not yet support the claim.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/verify/"
              className="royal-button royal-button-primary rounded-lg bg-[#D4AF37] px-4 py-2.5 text-sm font-bold text-black"
            >
              Verify offline
            </Link>
            <Link
              href="/observatory/"
              className="rounded-lg border border-[#B8860B]/40 px-4 py-2.5 text-sm text-[#F2D675]"
            >
              Evidence Observatory
            </Link>
            <Link
              href="/proof/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Proof Registry
            </Link>
            <Link
              href="/evaluate/"
              className="rounded-lg border border-zinc-600 px-4 py-2.5 text-sm text-zinc-100"
            >
              Evaluate evidence
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-emerald-400/90">
          What is VERIFIED · capsule-scoped
        </p>
        <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Public baseline only</h2>
        <ul className="mt-8 space-y-3">
          {[
            {
              id: "ART-L7-REPLAY-001",
              body: "Valid-path deterministic replay under a sealed public capsule (INV-001 family).",
            },
            {
              id: "ART-L7-REJECT-001",
              body: "Illegal lifecycle transition rejection with sealed receipt under pure semantics.",
            },
            {
              id: "ART-L7-PARITY-001",
              body: "Exact hash agreement across independent Node and Python pure verifiers for the sealed parity capsule.",
            },
          ].map((v) => (
            <li
              key={v.id}
              className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 px-4 py-4"
            >
              <p className="font-mono text-sm text-[#F2D675]">{v.id}</p>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{v.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page border-b border-zinc-900 py-12">
        <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-500">Boundaries</p>
        <h2 className="mt-2 font-cinzel text-2xl text-zinc-100">Explicit limits of the public record</h2>
        <ul className="mt-8 space-y-4">
          {boundaries.map((b) => (
            <li key={b.label} className="rounded-xl border border-zinc-800 bg-black/25 p-5">
              <h3 className="font-mono text-xs uppercase tracking-wider text-zinc-400">{b.label}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">{b.body}</p>
            </li>
          ))}
        </ul>
        <p className="mt-6 text-sm text-zinc-500">
          Benchmarks, LIVE telemetry, and certification remain UNAVAILABLE until sealed public
          artifacts exist and pass independent pure verification.
        </p>
      </section>

      <section className="container-page py-12">
        <h2 className="font-cinzel text-xl text-zinc-100">Continue the journey</h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
          Inspect evidence, verify offline, challenge fixtures, then evaluate whether a bounded pilot
          is justified. Contact submission does not create an investment or pilot agreement.
        </p>
        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/observatory/" className="text-[#F2D675] hover:underline">
            Observatory →
          </Link>
          <Link href="/verify/" className="text-zinc-400 hover:text-[#F2D675]">
            Verify →
          </Link>
          <Link href="/challenge/" className="text-zinc-400 hover:text-[#F2D675]">
            Challenge →
          </Link>
          <Link href="/evaluate/" className="text-zinc-400 hover:text-[#F2D675]">
            Evaluate →
          </Link>
        </div>
      </section>
    </main>
  );
}
