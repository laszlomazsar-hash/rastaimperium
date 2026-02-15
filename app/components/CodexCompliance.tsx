type CoverageNode = { layer: string; coverage: number };

export function CodexCompliance({ coverage }: { coverage: CoverageNode[] }) {
  return (
    <section>
      <h3>Article II Trace Coverage</h3>
      <ul>
        {coverage.map((node) => (
          <li key={node.layer}>
            {node.layer}: {node.coverage}%
          </li>
        ))}
      </ul>
    </section>
  );
}
