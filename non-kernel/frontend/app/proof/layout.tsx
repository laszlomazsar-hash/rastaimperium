import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Proof Registry — Sealed AI governance evidence",
  description:
    "Public proof library for deterministic AI governance: replay parity, illegal-transition rejection, and cross-runtime parity. Filter by status and invariant. Unproven claims labelled UNAVAILABLE.",
  keywords: [
    "AI proof registry",
    "deterministic replay",
    "auditable AI",
    "AI governance evidence",
    "sealed capsules",
  ],
  openGraph: {
    title: "Proof Registry — Sealed AI governance evidence",
    description:
      "Inspect VERIFIED public capsules for deterministic replay and illegal-transition rejection. No fabricated production hashes.",
    url: "https://rastaimperium.com/proof/",
  },
};

export default function ProofLayout({ children }: { children: React.ReactNode }) {
  return children;
}
