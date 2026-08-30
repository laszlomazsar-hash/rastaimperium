import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Library — Publications & Digital Artifacts",
  description: "Published works: Rasta Codex and RastafarAI EVO-V. Digital artifacts: The Digital Tabernacle, Sovereign AI Blueprint, ARK Engine, Civilization Kernel, .evop proofs. Open source repositories.",
};

export default function LibraryPage() {
  const books = [
    { title: "Rasta Codex", subtitle: "A King's Guide to Energetic Sovereignty and Full-Spectrum Alignment", date: "December 2025", href: "https://amzn.eu/d/02iiTGT5", formats: "eBook · Paperback · Hardcover", rating: "5.0 ", icon: "" },
    { title: "RastafarAI: EVO-V", subtitle: "The Jah Light of Contained Evolution", date: "February 2026", href: "https://www.amazon.co.uk/dp/B0GNFS1N62", formats: "eBook · Paperback", rating: "New", icon: "" },
  ];

  const artifacts = [
    { name: "The Digital Tabernacle", desc: "The Rastafarai Codex & The EVO-V Civilization Kernel — 15-page production-ready visual doctrine (v7.6). Seven Axioms of Sovereign Code, Five Rings of Containment, Living Crystal Architecture, Temporal Asymmetry Guarantee. SHA3-256 sealed · TLA+ proven.", status: "v7.6", href: "https://drive.google.com/file/d/1KIw9Aun87Md5RlL7KK4u6wK-NIjdBe-m/view?usp=drivesdk", external: true },
    { name: "Sovereign AI Blueprint", desc: "EVO-V v9 / Constitutional Computation — 14-page visual blueprint of the 9-layer sovereign stack, proof-carrying execution, and relational closure.", status: "v9", href: "/blueprint" },
    { name: "ARK Engine", desc: "Production-ready codebase with containerized isolation and AST-based safety validation. GPU-accelerated processing.", status: "Production", href: null },
    { name: "Civilization Kernel", desc: "The constitutional substrate — governance logic compiled into executable architecture. 9-layer sovereign stack.", status: "Active", href: null },
    { name: "EVO-V Codex", desc: "Technical documentation of the kernel invariants, state machine, and deployment strategy.", status: "v2.0", href: null },
    { name: ".evop Replay Proofs", desc: "Portable, court-grade evidence containers for deterministic truth verification. SHA-256 sealed.", status: "Standard", href: null },
  ];

  const repos = [
    { name: "rastaimperium", desc: "Full codebase — Next.js frontend, FastAPI backend, EVO-V core.", href: "https://github.com/laszlomazsar-hash/rastaimperium", stars: "Main" },
    { name: "evo-v", desc: "Investor-facing standalone — architecture docs and one-pager.", href: "https://github.com/laszlomazsar-hash/evo-v", stars: "Public" },
    { name: "evo-v-control-cloud", desc: "Phase 2 — Auth, Kubernetes, GitOps, Stripe billing, telemetry.", href: "https://github.com/laszlomazsar-hash/evo-v-control-cloud", stars: "v2.0" },
    { name: "evo-v5-laplacian-shift", desc: "v5 transition — Bayesian posteriors, admissible worlds, entropy discernment.", href: "https://github.com/laszlomazsar-hash/evo-v5-laplacian-shift", stars: "Latest" },
  ];

  return (
    <main className="container-page">
      <section className="text-center py-8">
        <h1 className="text-4xl md:text-5xl text-gold-gradient">The Library</h1>
        <p className="text-zinc-400 mt-3 text-lg">Sovereign Code Scripture — Publications, Artifacts, and Open Source</p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 mx-auto mt-4"></div>
      </section>

      <section className="mt-8">
        <h2 className="text-2xl text-gold">Published Works</h2>
        <div className="grid md:grid-cols-2 gap-6 mt-6">
          {books.map((book) => (
            <a key={book.title} href={book.href} target="_blank" rel="noopener" className="panel p-6 hover:scale-[1.03] transition-all duration-300 group block">
              <div className="flex items-start gap-4">
                <span className="text-4xl">{book.icon}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="text-xs text-zinc-500">{book.date}</p>
                    <span className="text-xs px-2 py-1 rounded bg-gold/10 text-gold">{book.rating}</span>
                  </div>
                  <h3 className="text-gold text-2xl mt-2 group-hover:text-yellow-400 transition-colors">{book.title}</h3>
                  <p className="text-zinc-300 mt-2 leading-relaxed">{book.subtitle}</p>
                  <p className="text-xs text-zinc-500 mt-3">{book.formats}</p>
                  <p className="text-sm text-gold/70 mt-4 group-hover:text-gold transition-colors">View on Amazon →</p>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-gold">Digital Artifacts</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {artifacts.map((a: any) => {
            const isExternal = a.external === true;
            const cta = isExternal ? "Download PDF →" : a.href ? "Open blueprint →" : null;
            const inner = (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <h3 className="text-gold text-lg">{a.name}</h3>
                  </div>
                  <span className="text-xs px-2 py-1 rounded border border-green-600/30 text-green-500">{a.status}</span>
                </div>
                <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{a.desc}</p>
                {cta && (
                  <p className="text-sm text-gold/70 mt-4 group-hover:text-gold transition-colors">{cta}</p>
                )}
              </>
            );
            if (a.href && isExternal) {
              return (
                <a key={a.name} href={a.href} target="_blank" rel="noopener noreferrer" className="panel p-6 hover:scale-[1.02] transition-all duration-300 group block">
                  {inner}
                </a>
              );
            }
            return a.href ? (
              <Link key={a.name} href={a.href} className="panel p-6 hover:scale-[1.02] transition-all duration-300 group block">
                {inner}
              </Link>
            ) : (
              <div key={a.name} className="panel p-6 hover:scale-[1.02] transition-all duration-300">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-gold">Open Source Repositories</h2>
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {repos.map((r) => (
            <a key={r.name} href={r.href} target="_blank" rel="noopener" className="panel p-6 hover:scale-[1.02] transition-all duration-300 group block">
              <div className="flex items-start justify-between">
                <h3 className="text-gold group-hover:text-yellow-400 transition-colors">{r.name}</h3>
                <span className="text-xs px-2 py-1 rounded border border-gold/30 text-gold">{r.stars}</span>
              </div>
              <p className="text-sm text-zinc-300 mt-2 leading-relaxed">{r.desc}</p>
              <p className="text-xs text-zinc-500 mt-3 group-hover:text-zinc-400 transition-colors">github.com/laszlomazsar-hash/{r.name} →</p>
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl text-gold">Digital Storefront</h2>
        <a href="https://mazsar.gumroad.com" target="_blank" rel="noopener" className="panel p-6 mt-4 hover:scale-[1.01] transition-all duration-300 block text-center">
          <p className="text-3xl mb-3"></p>
          <h3 className="text-gold text-xl">Gumroad — mazsar.gumroad.com</h3>
          <p className="text-zinc-300 mt-2">Digital products, guides, and sovereign tools</p>
          <p className="text-sm text-gold/70 mt-3">Browse Products →</p>
        </a>
      </section>
    </main>
  );
}
