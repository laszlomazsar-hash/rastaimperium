import Link from "next/link";
import { mapSections, pillars } from "./components/site-data";

const gateways = [
  {
    title: "Curiosity",
    subtitle: "Daily Resonance Codex · 30-day practice",
    href: "https://jah.rastaimperium.com/nuggets",
  },
  {
    title: "Recognition",
    subtitle: "Governance / covenant architecture",
    href: "https://codex.rastaimperium.com/manifest",
  },
  {
    title: "Codex",
    subtitle: "Economic portal and codex editions",
    href: "https://codex.rastaimperium.com/codex",
  },
  {
    title: "ARK Engine",
    subtitle: "EVO-V kernel integration",
    href: "https://jah.rastaimperium.com/simulate",
  },
];

export default function HomePage() {
  return (
    <main>
      <section className="container-page text-center py-16">
        <p className="text-gold text-xl">🦁 ☀️ 🌀</p>
        <h1 className="text-4xl md:text-6xl text-gold mt-2">
          The Rasta Imperium — A Sovereign Mythic-Technical Civilization
        </h1>
        <p className="mt-4 text-zinc-200 max-w-3xl mx-auto">
          Proceed with intention. Enter the field through clarity, alignment, and executable sovereignty.
        </p>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold text-center">Five Pillars</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5 mt-6">
          {pillars.map((pillar) => (
            <a key={pillar.name} href={pillar.href} className="panel p-4 hover:bg-green/35 transition-colors">
              <p className="text-2xl">{pillar.icon}</p>
              <h3 className="text-gold mt-2">{pillar.name}</h3>
              <p className="text-sm mt-2 text-zinc-200">{pillar.description}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold">Vision</h2>
        <p className="panel p-6 mt-4 text-zinc-100">
          Rasta Imperium builds mythic language into technical systems: constitutional intelligence, coherent governance,
          and practical products that move founders from fragmented motion to sovereign execution.
        </p>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold">Join the Imperium</h2>
        <form className="panel p-6 mt-4 grid gap-3 md:grid-cols-[1fr_auto]" action="#" method="post">
          <input
            type="email"
            required
            placeholder="Email address"
            className="rounded-md border border-gold/40 bg-black px-3 py-2 text-zinc-100"
            aria-label="Email address"
          />
          <button className="rounded-md bg-gold text-black px-4 py-2 font-bold">Join</button>
        </form>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold">Featured Products</h2>
        <div className="grid gap-4 md:grid-cols-3 mt-6">
          <a className="panel p-4" href="https://jah.rastaimperium.com">
            <h3 className="text-gold">Jah Intelligence</h3>
            <p className="mt-2 text-zinc-200">Precision reasoning layer for constitutional AI workflows.</p>
          </a>
          <a className="panel p-4" href="https://codex.rastaimperium.com">
            <h3 className="text-gold">Codex Library</h3>
            <p className="mt-2 text-zinc-200">Canonical artifacts, editions, and implementation manuals.</p>
          </a>
          <Link className="panel p-4" href="/consulting">
            <h3 className="text-gold">Consulting</h3>
            <p className="mt-2 text-zinc-200">Direct architecture support for sovereign product delivery.</p>
          </Link>
        </div>
      </section>

      <section className="container-page">
        <h2 className="text-3xl text-gold">Live Gateway Continuity</h2>
        <div className="grid gap-4 md:grid-cols-2 mt-6">
          {gateways.map((gateway) => (
            <a key={gateway.title} className="panel p-4" href={gateway.href}>
              <h3 className="text-gold">{gateway.title}</h3>
              <p className="text-zinc-200 mt-2">{gateway.subtitle}</p>
            </a>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <h2 className="text-3xl text-gold">Imperium Map (12 Planned Sections)</h2>
        <ul className="panel p-6 mt-6 grid gap-2 md:grid-cols-2">
          {mapSections.map((item) => (
            <li key={item}>• {item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
