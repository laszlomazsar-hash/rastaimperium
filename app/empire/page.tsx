import Link from "next/link";

const foundations = [
  {
    heading: "Cosmology",
    text: "Rasta Imperium frames reality as layered coherence: spirit, language, systems, and stewardship moving in one alignment loop.",
  },
  {
    heading: "Lineage",
    text: "The lineage traces from ancestral memory into modern execution, carrying cultural sovereignty into every artifact and protocol.",
  },
  {
    heading: "Mythic Foundations",
    text: "Mythic language provides symbolic orientation: why the mission exists, who it serves, and what integrity looks like under pressure.",
  },
  {
    heading: "Technical Foundations",
    text: "Technical rigor converts the narrative into architecture: codified practices, operational standards, and evolvable delivery systems.",
  },
];

export default function EmpirePage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <p style={{ textTransform: "uppercase", fontWeight: 700, color: "#0f766e", letterSpacing: "0.04em" }}>Empire</p>
      <h1>Cosmology, Lineage, and Living Foundations</h1>
      <p>
        The Empire page defines the origin story and structural DNA of Rasta Imperium: a cosmology that informs action,
        a lineage that preserves continuity, and a dual foundation that balances mythic meaning with technical precision.
      </p>

      <section style={{ display: "grid", gap: "1rem", marginTop: "1.5rem" }}>
        {foundations.map((item) => (
          <article key={item.heading} style={{ border: "1px solid #d1d5db", borderRadius: "10px", padding: "1rem" }}>
            <h2 style={{ marginTop: 0 }}>{item.heading}</h2>
            <p style={{ marginBottom: 0 }}>{item.text}</p>
          </article>
        ))}
      </section>

      <p style={{ marginTop: "1.5rem" }}>
        Continue into the operating structure via the <Link href="/pillars">Five Pillars</Link>.
      </p>
    </main>
  );
}
