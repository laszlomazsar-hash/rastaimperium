const sourceAssets = [
  "pitch-narrative-outline.md",
  "one-pager.md",
  "pricing-matrix.md",
  "objection-handling-notes.md",
  "deck-sections.md",
];

const exportAssets = [
  "pitch-narrative-outline.pdf",
  "pitch-narrative-outline.pptx",
  "one-pager.pdf",
  "one-pager.pptx",
  "pricing-matrix.pdf",
  "pricing-matrix.pptx",
  "objection-handling-notes.pdf",
  "objection-handling-notes.pptx",
  "deck-sections.pdf",
  "deck-sections.pptx",
];

export default function SalesAssetsPage() {
  return (
    <main style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1>Approved Sales Collateral</h1>
      <p>
        Source-of-truth collateral lives in <code>docs/sales</code>. Use this page to request or download approved materials.
      </p>

      <section>
        <h2>Request approval / latest revision</h2>
        <p>
          <a href="mailto:sales@rastaimperium.com?subject=Collateral%20Request">Email sales@rastaimperium.com</a>
        </p>
      </section>

      <section>
        <h2>Editable source assets (Markdown)</h2>
        <ul>
          {sourceAssets.map((file) => (
            <li key={file}>
              <a href={`/sales-assets/source/${file}`} download>
                {file}
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Binary exports (PDF/PPTX)</h2>
        <p>Run <code>bash docs/sales/build-exports.sh</code> to generate the latest exports.</p>
        <ul>
          {exportAssets.map((file) => (
            <li key={file}>
              <a href={`/sales-assets/exports/${file}`} download>
                {file}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
