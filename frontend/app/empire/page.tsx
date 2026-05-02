export default function EmpirePage() {
  return (
    <main className="container-page">
      <h1 className="text-4xl text-gold">The Empire</h1>
      <p className="panel p-6 mt-6">
        The Empire is the cosmology layer of Rasta Imperium: lineage, covenant, and narrative architecture translated into
        operational systems. Mythic declarations define intent; technical protocols define execution.
      </p>
      <div className="grid gap-4 md:grid-cols-3 mt-6">
        <article className="panel p-4">
          <h2 className="text-gold text-2xl">Cosmology</h2>
          <p className="mt-2">A sovereign frame for how value, identity, and responsibility cohere under one constitutional field.</p>
        </article>
        <article className="panel p-4">
          <h2 className="text-gold text-2xl">Lineage</h2>
          <p className="mt-2">The founder pathway, proof artifacts, and continuity from doctrine to deployed product.</p>
        </article>
        <article className="panel p-4">
          <h2 className="text-gold text-2xl">Mythic-Technical Foundation</h2>
          <p className="mt-2">Design language that keeps visionary ambition bound to measurable systems outcomes.</p>
        </article>
      </div>
    </main>
  );
}
