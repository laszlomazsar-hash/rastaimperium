import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Library — Publications & Digital Artifacts",
  description:
    "Published works and digital artifacts. Narrative and design documents; production claims require sealed evidence (see Limitations).",
};

export default function LibraryPage() {
  const books = [
    {
      title: "Rasta Codex",
      subtitle: "A King's Guide to Energetic Sovereignty and Full-Spectrum Alignment",
      date: "December 2025",
      href: "https://amzn.eu/d/02iiTGT5",
      formats: "eBook · Paperback · Hardcover",
      rating: "5.0",
    },
    {
      title: "RastafarAI: EVO-V",
      subtitle: "The Jah Light of Contained Evolution",
      date: "February 2026",
      href: "https://www.amazon.co.uk/dp/B0GNFS1N62",
      formats: "eBook · Paperback",
      rating: "New",
    },
  ];

  const artifacts = [
    {
      name: "The Digital Tabernacle",
      desc: "The Rastafarai Codex & The EVO-V Civilization Kernel — visual doctrine. Seven Axioms, containment framing, architecture narrative.",
      status: "DOCUMENT",
      href: "https://drive.google.com/file/d/1KIw9Aun87Md5RlL7KK4u6wK-NIjdBe-m/view?usp=drivesdk",
      external: true,
    },
    {
      name: "Living Crystal Blueprint",
      desc: "RASTA IMPERIUM — sovereign intelligence architecture narrative: 9-layer stack and related design material.",
      status: "DOCUMENT",
      href: "https://drive.google.com/file/d/1xycb92ZMLx0yof4ehlpB8w3E0Gl7t3G0/view?usp=drivesdk",
      external: true,
    },
    {
      name: "The Sacred Blueprint",
      desc: "Declassifying the EVO Architecture — constitutional physics framing and cognitive dynamics narrative.",
      status: "DOCUMENT",
      href: "https://drive.google.com/file/d/17tKDmsxlj0AKdtbvCMfZwjiJeLZqAKzV/view?usp=drivesdk",
      external: true,
    },
    {
      name: "Genetic Blueprint of Sovereign AI",
      desc: "Mapping lineage from ARK / Omega roots through EVO-V narrative to commercial EVO-G framing.",
      status: "DOCUMENT",
      href: "https://drive.google.com/file/d/1sfRPti0RY4QQULGDJXHHE3U46X-JZ6n-/view?usp=drivesdk",
      external: true,
    },
    {
      name: "EVO-V Sovereign Intelligence",
      desc: "Deterministic governance and containment framing for autonomous systems (design narrative).",
      status: "DOCUMENT",
      href: "https://drive.google.com/file/d/1IWfMr2TE3JIscDRSY6jie8py2gCFFg7e/view?usp=drivesdk",
      external: true,
    },
    {
      name: "EVO-G Operational Assurance",
      desc: "Trusted automation framing for public sector contexts. Deployment claims require separate evidence.",
      status: "DOCUMENT",
      href: "https://drive.google.com/file/d/1CWncp6LIobmEcygPNNDPmj5B8_nC2fvC/view?usp=drivesdk",
      external: true,
    },
    {
      name: "Sovereign AI Blueprint",
      desc: "EVO-V constitutional computation — visual blueprint of the 9-layer stack on this site.",
      status: "ON-SITE",
      href: "/blueprint",
    },
    {
      name: "Sealed L7 capsules",
      desc: "Public ART-L7 replay / reject / parity artifacts with independent verifiers — see Proof Registry.",
      status: "VERIFIED (scoped)",
      href: "/proof",
    },
  ];

  const productLinks = [
    { name: "Product pathway", href: "/product/", detail: "Capabilities, pilots, commercial models" },
    { name: "Applications & Genesis", href: "/applications/", detail: "Kernel, Observatory, DSL, demos" },
    { name: "Observatory demo", href: "/observatory/", detail: "Synthetic telemetry · DEMONSTRATION" },
    { name: "Pricing posture", href: "/pricing/", detail: "Pilot ranges and enterprise terms" },
    { name: "Design partner pilots", href: "/institutional-pilots/", detail: "Fixed-scope institutional path" },
    { name: "Case studies", href: "/case-studies/", detail: "Evidence before logos" },
  ];

  const repos = [
    {
      name: "rastaimperium",
      desc: "Public constitutional and verification layer (this site).",
      href: "https://github.com/laszlomazsar-hash/rastaimperium",
      stars: "Main",
    },
    {
      name: "evo-v",
      desc: "Related EVO-V public materials and docs.",
      href: "https://github.com/laszlomazsar-hash/evo-v",
      stars: "Public",
    },
    {
      name: "evo-v-control-cloud",
      desc: "Control / cloud related repository.",
      href: "https://github.com/laszlomazsar-hash/evo-v-control-cloud",
      stars: "Related",
    },
    {
      name: "evo-v5-laplacian-shift",
      desc: "Research transition materials.",
      href: "https://github.com/laszlomazsar-hash/evo-v5-laplacian-shift",
      stars: "Research",
    },
  ];

  return (
    <main className="royal-page overflow-hidden">
      <section className="border-b border-[#B8860B]/20">
        <div className="container-page py-12 text-center">
          <h1 className="text-4xl text-gold-gradient md:text-5xl">The Library</h1>
          <p className="mt-3 text-lg text-zinc-400">
            Publications, design documents, product surface, and open repositories
          </p>
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-zinc-500">
            Most entries below are narrative or design documents. Production, deployment, and
            “court-grade” claims require sealed public evidence — see Limitations and the Proof
            Registry.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link href="/proof/" className="text-sm text-[#F2D675]">
              Proof Registry →
            </Link>
            <Link href="/product/" className="text-sm text-zinc-400">
              Product →
            </Link>
            <Link href="/limitations/" className="text-sm text-zinc-400">
              Limitations →
            </Link>
            <Link href="/research/" className="text-sm text-zinc-400">
              Research →
            </Link>
            <Link href="/thanks-and-praise/" className="text-sm text-zinc-400">
              Thanks & Praise →
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page mt-10">
        <h2 className="text-2xl text-[#F2D675]">Commercial & product surface</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {productLinks.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="rounded-xl border border-zinc-800 bg-black/30 p-5 transition hover:border-[#B8860B]/40"
            >
              <h3 className="text-lg text-zinc-100">{p.name}</h3>
              <p className="mt-2 text-sm text-zinc-500">{p.detail}</p>
              <p className="mt-3 text-sm text-[#F2D675]">Open →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-page mt-12">
        <h2 className="text-2xl text-[#F2D675]">Published Works</h2>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {books.map((book) => (
            <a
              key={book.title}
              href={book.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-zinc-800 bg-black/30 p-6 transition hover:border-[#B8860B]/40"
            >
              <div className="flex justify-between">
                <p className="text-xs text-zinc-500">{book.date}</p>
                <span className="rounded bg-[#D4AF37]/10 px-2 py-1 text-xs text-[#D4AF37]">
                  {book.rating}
                </span>
              </div>
              <h3 className="mt-2 text-xl text-[#F2D675]">{book.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{book.subtitle}</p>
              <p className="mt-3 text-xs text-zinc-500">{book.formats}</p>
              <p className="mt-4 text-sm text-[#D4AF37]/80">View on Amazon →</p>
            </a>
          ))}
        </div>
      </section>

      <section className="container-page mt-12">
        <h2 className="text-2xl text-[#F2D675]">Digital Artifacts</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {artifacts.map((a) => {
            const isExternal = a.external === true;
            const cta = isExternal ? "Open document →" : a.href ? "Open →" : null;
            const inner = (
              <>
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-lg text-[#F2D675]">{a.name}</h3>
                  <span className="shrink-0 rounded border border-zinc-700 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                    {a.status}
                  </span>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">{a.desc}</p>
                {cta && <p className="mt-4 text-sm text-[#D4AF37]/80">{cta}</p>}
              </>
            );
            if (a.href && isExternal) {
              return (
                <a
                  key={a.name}
                  href={a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block rounded-xl border border-zinc-800 bg-black/30 p-6 transition hover:border-[#B8860B]/40"
                >
                  {inner}
                </a>
              );
            }
            return a.href ? (
              <Link
                key={a.name}
                href={a.href}
                className="block rounded-xl border border-zinc-800 bg-black/30 p-6 transition hover:border-[#B8860B]/40"
              >
                {inner}
              </Link>
            ) : (
              <div key={a.name} className="rounded-xl border border-zinc-800 bg-black/30 p-6">
                {inner}
              </div>
            );
          })}
        </div>
      </section>

      <section className="container-page mt-12 pb-16">
        <h2 className="text-2xl text-[#F2D675]">Open Source Repositories</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {repos.map((r) => (
            <a
              key={r.name}
              href={r.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-xl border border-zinc-800 bg-black/30 p-6 transition hover:border-[#B8860B]/40"
            >
              <div className="flex items-start justify-between">
                <h3 className="text-[#F2D675]">{r.name}</h3>
                <span className="rounded border border-[#B8860B]/30 px-2 py-1 text-xs text-[#D4AF37]">
                  {r.stars}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-zinc-300">{r.desc}</p>
              <p className="mt-3 text-xs text-zinc-500">github.com/laszlomazsar-hash/{r.name} →</p>
            </a>
          ))}
        </div>

        <div className="mt-12 rounded-xl border border-zinc-800 bg-black/20 p-6 text-center">
          <p className="text-sm text-zinc-400">
            Storefront and product links are external. Verification claims live on this site’s Proof
            and Limitations surfaces.
          </p>
          <a
            href="https://mazsar.gumroad.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-sm text-[#F2D675]"
          >
            Gumroad — mazsar.gumroad.com →
          </a>
        </div>
      </section>
    </main>
  );
}
