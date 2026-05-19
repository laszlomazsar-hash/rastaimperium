export default function ArchitecturePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-4xl font-bold mb-6">Architecture</h1>
      <p className="text-zinc-300 leading-8">
        The architecture is intentionally split between a public narrative layer (this site)
        and a separate execution layer (EVO-V runtime repository). This separation protects clarity,
        governance accountability, and implementation discipline.
      </p>
    </main>
  );
}
