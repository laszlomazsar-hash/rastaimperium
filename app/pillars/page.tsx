const rows = [
  ["Codex", "Canonical knowledge base and product doctrine", "https://codex.rastaimperium.com"],
  ["Kernel", "Core constitutional substrate and world model", "/empire"],
  ["Engine", "Execution and recursive activation layer", "https://jah.rastaimperium.com"],
  ["Ethics", "Constraint systems and responsible governance", "/empire"],
  ["Intelligence", "Jah Conciseness cognitive service", "https://jah.rastaimperium.com"],
];

export default function PillarsPage() {
  return (
    <main className="container-page">
      <h1 className="text-4xl text-gold">Five Pillars</h1>
      <p className="mt-4 text-zinc-200">
        Each pillar is declarative in mission, precise in implementation, and benefit-first in outcome.
      </p>
      <div className="mt-6 grid gap-4">
        {rows.map(([name, detail, href]) => (
          <a key={name} href={href} className="panel p-5">
            <h2 className="text-2xl text-gold">{name}</h2>
            <p className="mt-2">{detail}</p>
          </a>
        ))}
      </div>
    </main>
  );
}
