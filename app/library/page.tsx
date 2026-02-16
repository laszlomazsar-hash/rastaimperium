export default function LibraryPage() {
  return (
    <main style={{ padding: "2rem", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif", lineHeight: 1.6 }}>
      <p style={{ textTransform: "uppercase", fontWeight: 700, color: "#0f766e", letterSpacing: "0.04em" }}>Library</p>
      <h1>Codex Library Overview</h1>
      <p>
        The Library is the public-facing map into the Codex: articles, frameworks, and doctrinal references that define
        the language and mechanics of Rasta Imperium.
      </p>

      <section style={{ border: "1px solid #d1d5db", borderRadius: "10px", padding: "1rem", marginTop: "1.5rem" }}>
        <h2 style={{ marginTop: 0 }}>What you will find in the Codex</h2>
        <ul>
          <li>Foundational articles and canonical concepts.</li>
          <li>Architecture narratives connecting mythic and technical layers.</li>
          <li>Operational guidance for applying Imperium principles in practice.</li>
        </ul>
        <p style={{ marginBottom: 0 }}>
          Open the full Codex at{" "}
          <a href="https://codex.rastaimperium.com" target="_blank" rel="noreferrer">
            codex.rastaimperium.com
          </a>
          .
        </p>
      </section>
    </main>
  );
}
