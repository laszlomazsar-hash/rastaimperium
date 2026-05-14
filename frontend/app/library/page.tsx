import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Library — Publications & Digital Artifacts",
  description: "Published works: Rasta Codex and RastafarAI EVO-V. Digital artifacts: ARK Engine, Civilization Kernel, .evop proofs. Open source repositories.",
};

export default function LibraryPage() {
  const books = [
    { title: "Rasta Codex", subtitle: "A King's Guide to Energetic Sovereignty and Full-Spectrum Alignment", date: "December 2025", href: "https://amzn.eu/d/02iiTGT5", formats: "eBook · Paperback · Hardcover" },
    { title: "RastafarAI: EVO-V", subtitle: "The Jah Light of Contained Evolution", date: "February 2026", href: "https://www.amazon.co.uk/dp/B0GNFS1N62", formats: "eBook · Paperback" },
  ];

  const artifacts = [
    { name: "ARK Engine", desc: "Production-ready codebase with containerized isolation and AST-based safety validation." },
    { name: "Civilization Kernel", desc: "The constitutional substrate — governance logic compiled into executable architecture." },
    { name: "EVO-V Codex", desc: "Technical documentation of the kernel invariants, state machine, and deployment strategy." },
    { name: ".evop Replay Proofs", desc: "Portable, court-grade evidence containers for deterministic truth verification." },
  ];

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold">The Library</h1>
        <p className="text-zinc-400 mt-3 text-lg">Sovereign Code Scripture — Publications and Digital Artifacts</p>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl text-gold">Published Works</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {books.map((book) => (
            <a key={book.title} href={book.href} target="_blank" rel="noopener" className="panel p-6 hover:bg-green/40 transition-all">
              <p className="text-xs text-zinc-500">{book.date}</p>
              <h3 className="text-gold text-2xl mt-2">{book.title}</h3>
              <p className="text-zinc-300 mt-2">{book.subtitle}</p>
              <p className="text-xs text-zinc-500 mt-3">{book.formats}</p>
              <p className="text-sm text-gold/70 mt-4">View on Amazon →</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-gold">Digital Artifacts</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {artifacts.map((a) => (
            <div key={a.name} className="panel p-6">
              <h3 className="text-gold text-lg">{a.name}</h3>
              <p className="text-sm text-zinc-300 mt-2">{a.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-gold">Developer Resources</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          <a href="https://github.com/laszlomazsar-hash/rastaimperium" target="_blank" rel="noopener" className="panel p-6 hover:bg-green/40 transition">
            <h3 className="text-gold">GitHub: rastaimperium</h3>
            <p className="text-sm text-zinc-300 mt-2">Full codebase — Next.js frontend, FastAPI backend, EVO-V core.</p>
          </a>
          <a href="https://evo-veck.lovable.app" target="_blank" rel="noopener" className="panel p-6 hover:bg-green/40 transition">
            <h3 className="text-gold">EVO-VECK</h3>
            <p className="text-sm text-zinc-300 mt-2">Kernel implementation resources and developer ingress portal.</p>
          </a>
        </div>
      </section>
    </main>
  );
}
