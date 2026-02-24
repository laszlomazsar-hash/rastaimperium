const codexLinks = [
  "https://codex.rastaimperium.com",
  "https://codex.rastaimperium.com/codex",
  "https://codex.rastaimperium.com/codex-library",
];

export default function LibraryPage() {
  return (
    <main className="container-page">
      <h1 className="text-4xl text-gold">Codex Library</h1>
      <p className="panel p-6 mt-6">
        The Codex Library is the canonical archive for doctrine, editions, and transmission artifacts.
      </p>
      <ul className="mt-6 grid gap-3">
        {codexLinks.map((href) => (
          <li key={href}>
            <a href={href} className="panel p-4 block hover:bg-green/35 transition-colors">
              {href}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
