import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Challenge Lab — Adversarial AI governance fixtures",
  description:
    "Safe deterministic challenge fixtures for illegal transitions, replay mismatch, and receipt integrity. Inspect input, expected behaviour, and invariants. Isolated from production.",
  keywords: [
    "AI challenge lab",
    "adversarial verification",
    "illegal transition",
    "replay mismatch",
    "deterministic fixtures",
    "AI governance audit",
  ],
  openGraph: {
    title: "Challenge Lab — Adversarial verification",
    description:
      "Try to break the invariant. Deterministic fixtures only — no production mutation endpoints.",
    url: "https://rastaimperium.com/challenge/",
  },
};

export default function ChallengeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
