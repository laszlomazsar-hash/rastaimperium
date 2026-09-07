import type { Metadata } from "next";
import {
  StatusBadge,
  EvidenceChain,
  ArtifactCard,
  TrustRail,
  ReproduceOffline,
  LayerCard,
} from "@/components/design-system";

export const metadata: Metadata = {
  title: "Design System — Phase B",
  description:
    "Internal design-system showcase for Rasta Imperium. Presentation layer only. No evidence semantics changed.",
  robots: { index: false, follow: false },
};

export default function DesignSystemPage() {
  return (
    <main className="royal-page min-h-screen">
      <section className="border-b border-[rgba(242,214,117,0.15)]">
        <div className="container-page py-12 lg:py-16">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-[#d4af37]">
            Phase B · Design system
          </p>
          <h1 className="mt-3 font-cinzel text-4xl text-zinc-100 sm:text-5xl">
            Component showcase
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-zinc-400">
            Reusable visual system for a sovereign constitutional-technology platform.
            Presentation only — evidence capsules, hashes, and claim statuses are unchanged.
          </p>
        </div>
      </section>

      <section className="container-page space-y-16 py-12">
        {/* Typography */}
        <div>
          <h2 className="font-cinzel text-2xl text-zinc-100">Typography</h2>
          <div className="mt-6 space-y-4 rounded-xl border border-[rgba(242,214,117,0.2)] bg-[rgba(15,18,13,0.9)] p-6">
            <p className="font-cinzel text-3xl text-zinc-50">Display — Rasta Imperium</p>
            <p className="text-base leading-7 text-zinc-300">
              Body — Deterministic governance for institutions that cannot afford opaque autonomy.
            </p>
            <p className="font-mono text-sm text-zinc-400">
              Technical — ART-L7-REPLAY-001 · 3f1705c85e156b965908f9b604c43246…
            </p>
          </div>
        </div>

        {/* Status system */}
        <div>
          <h2 className="font-cinzel text-2xl text-zinc-100">Status system</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Evidence statuses (claim-level) and process labels are visually distinct.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <StatusBadge status="VERIFIED" />
            <StatusBadge status="DEMONSTRATION" />
            <StatusBadge status="UNAVAILABLE" />
            <StatusBadge status="INVALID" />
            <StatusBadge status="SPEC_DRIFT" />
            <StatusBadge status="INDETERMINATE" />
            <StatusBadge status="MALFORMED" />
            <StatusBadge status="HISTORICAL" />
            <StatusBadge status="EARNED" />
            <StatusBadge status="OPEN" />
            <StatusBadge status="FROZEN" />
            <StatusBadge status="SEALED" />
          </div>
        </div>

        {/* Trust rail */}
        <div>
          <h2 className="font-cinzel text-2xl text-zinc-100">Trust rail</h2>
          <div className="mt-6">
            <TrustRail />
          </div>
        </div>

        {/* Evidence chain */}
        <div>
          <h2 className="font-cinzel text-2xl text-zinc-100">Evidence chain</h2>
          <div className="mt-6 max-w-2xl">
            <EvidenceChain
              artifactId="ART-L7-REPLAY-001"
              status="VERIFIED"
              claim="Deterministic replay under identical inputs and event order yields identical state, ledger head, and receipt hashes."
              evidence="Sealed public capsule ART-L7-REPLAY-001 with frozen expected hashes."
              verification="Independent Node and Python pure verifiers recompute hashes and match sealed values (exit 0)."
              reproduction="node non-kernel/frontend/scripts/verify-art-l7-replay-001.mjs — offline, no network, no mutation."
              limitations="Capsule-scoped only. Does not prove production EVO-V health, LIVE telemetry, or full-kernel parity."
            />
          </div>
        </div>

        {/* Artifact cards */}
        <div>
          <h2 className="font-cinzel text-2xl text-zinc-100">Artifact cards</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <ArtifactCard
              id="ART-L7-REPLAY-001"
              type="Deterministic replay"
              layer="L7 · Identity + Trust"
              status="VERIFIED"
              description="Valid-path deterministic replay (INV-001). Independent Node + Python hash agreement."
              verifyHref="/verify/"
              reproduceHref="/audit/"
              limitationsHref="/limitations/"
            />
            <ArtifactCard
              id="ART-L7-REJECT-001"
              type="Illegal transition rejection"
              layer="L7 · Identity + Trust"
              status="VERIFIED"
              description="Illegal lifecycle edge rejection with sealed receipt. State must not mutate."
              verifyHref="/verify/"
              reproduceHref="/audit/"
              limitationsHref="/limitations/"
            />
          </div>
        </div>

        {/* Layer cards */}
        <div>
          <h2 className="font-cinzel text-2xl text-zinc-100">Layer cards</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <LayerCard
              id="L7"
              title="Identity + Trust"
              description="Immutable replay ledger and cryptographic proofs. Strongest frozen public evidence."
              status="VERIFIED"
              href="/blueprint"
              emphasize
            />
            <LayerCard
              id="L8"
              title="Constitutional"
              description="Seven Articles — governance physics as constitutional constraints."
              status="UNAVAILABLE"
              href="/pillars"
            />
            <LayerCard
              id="L3"
              title="Operational Systems"
              description="Real-time invariant enforcement. Demonstration-level documentation."
              status="DEMONSTRATION"
            />
          </div>
        </div>

        {/* Reproduce offline */}
        <div>
          <h2 className="font-cinzel text-2xl text-zinc-100">Reproduce offline</h2>
          <div className="mt-6">
            <ReproduceOffline />
          </div>
        </div>

        <p className="border-t border-[rgba(242,214,117,0.12)] pt-8 text-center text-xs text-zinc-600">
          Phase B complete. Evidence semantics unchanged. Ready for review before Phase C.
        </p>
      </section>
    </main>
  );
}
