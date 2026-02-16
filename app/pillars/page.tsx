import Link from "next/link";

const pillarMap = [
  {
    name: "Codex",
    purpose: "Canonical knowledge base, doctrine, and living reference texts.",
    domain: "codex.rastaimperium.com",
    href: "https://codex.rastaimperium.com",
  },
  {
    name: "Kernel",
    purpose: "Core logic layer for principles, constraints, and stable identity rules.",
    domain: "rastaimperium.com/kernel",
    href: "/",
  },
  {
    name: "Engine",
    purpose: "Execution layer that transforms principles into repeatable workflows and outputs.",
    domain: "rastaimperium.com/engine",
    href: "/",
  },
  {
    name: "Ethics",
    purpose: "Governance and moral architecture for responsible, coherent system behavior.",
    domain: "rastaimperium.com/ethics",
    href: "/",
  },
  {
    name: "Intelligence",
    purpose: "Jah Conciseness reasoning surface for high-signal, sovereignty-preserving intelligence.",
    domain: "jah.rastaimperium.com",
    href: "https://jah.rastaimperium.com",
  },
];

export default function PillarsPage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "1000px", margin: "0 auto", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <p style={{ textTransform: "uppercase", fontWeight: 700, color: "#0f766e", letterSpacing: "0.04em" }}>Pillars</p>
      <h1>Five-Pillar Deep Dive</h1>
      <p>
        The Imperium operates through five integrated pillars. Each pillar has a clear function and, where available,
        a dedicated subdomain for focused exploration.
      </p>

      <section style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        {pillarMap.map((pillar) => (
          <article key={pillar.name} style={{ border: "1px solid #d1d5db", borderRadius: "10px", padding: "1rem" }}>
            <h2 style={{ marginTop: 0 }}>{pillar.name}</h2>
            <p>{pillar.purpose}</p>
            <p style={{ marginBottom: 0 }}>
              <strong>Mapped domain:</strong>{" "}
              {pillar.href.startsWith("http") ? (
                <a href={pillar.href} target="_blank" rel="noreferrer">
                  {pillar.domain}
                </a>
              ) : (
                <span>{pillar.domain}</span>
              )}
            </p>
          </article>
        ))}
      </section>

      <p style={{ marginTop: "1.5rem" }}>
        Begin with the <Link href="/library">Codex Library</Link> or preview <Link href="/intelligence">Jah Conciseness</Link>.
      </p>
    </main>
  );
}
