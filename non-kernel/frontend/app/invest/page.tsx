import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Invest & Support — Rasta Imperium",
  description: "Support the development of sovereign AI infrastructure. Invest in the future of deterministic governance and constitutional intelligence.",
};

export default function InvestPage() {
  return (
    <main className="container-page">
      <section className="text-center py-12">
        <h1 className="text-4xl md:text-5xl text-gold-gradient" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>
          Invest in Sovereignty
        </h1>
        <p className="text-zinc-400 mt-4 text-lg max-w-2xl mx-auto">
          Support the development of civilization-scale deterministic AI governance. 
          Every contribution fuels the architecture of a safer, more accountable future.
        </p>
        <div className="w-24 h-0.5 bg-gradient-to-r from-green-600 via-yellow-500 to-red-600 mx-auto mt-6"></div>
      </section>

      {/* WHAT YOU'RE FUNDING */}
      <section className="panel p-8 mt-4">
        <h2 className="text-2xl text-[#B8860B] mb-6" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>What Your Investment Supports</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="border border-[#B8860B]/20 rounded-lg p-6 hover:border-[#B8860B]/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="text-3xl mb-3">️</div>
            <h3 className="text-[#B8860B] font-bold mb-2">Infrastructure</h3>
            <p className="text-zinc-400 text-sm">Server costs, Railway hosting, domain maintenance, and development tools for the living kernel.</p>
          </div>
          <div className="border border-[#B8860B]/20 rounded-lg p-6 hover:border-[#B8860B]/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="text-3xl mb-3"></div>
            <h3 className="text-[#B8860B] font-bold mb-2">Research & Development</h3>
            <p className="text-zinc-400 text-sm">Advancing the neurosymbolic architecture, Bayesian governance, and the Laplacian Shift to v5.</p>
          </div>
          <div className="border border-[#B8860B]/20 rounded-lg p-6 hover:border-[#B8860B]/50 transition-all duration-300 hover:scale-[1.02]">
            <div className="text-3xl mb-3"></div>
            <h3 className="text-[#B8860B] font-bold mb-2">Publications & Outreach</h3>
            <p className="text-zinc-400 text-sm">Expanding the Rasta Codex, publishing research, and building the sovereign AI community.</p>
          </div>
        </div>
      </section>

      {/* BANK DETAILS */}
      <section className="mt-10">
        <div className="panel p-8 border-2 border-[#B8860B]/40 max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h2 className="text-2xl text-[#B8860B]" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>Direct Bank Transfer</h2>
            <p className="text-zinc-500 text-sm mt-2">Santander UK</p>
          </div>
          <div className="space-y-4 font-mono">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-zinc-400 text-sm">Account Name</span>
              <span className="text-zinc-100 font-bold">Laszlo Mazsar</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-zinc-400 text-sm">Sort Code</span>
              <span className="text-zinc-100 font-bold text-lg">09-01-28</span>
            </div>
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <span className="text-zinc-400 text-sm">Account Number</span>
              <span className="text-zinc-100 font-bold text-lg">30627007</span>
            </div>
            <div className="flex justify-between items-center pb-1">
              <span className="text-zinc-400 text-sm">Reference</span>
              <span className="text-[#B8860B] font-bold">EVO-V-INVEST</span>
            </div>
          </div>
          <div className="mt-6 p-4 rounded-lg bg-green-900/20 border border-green-800/30">
            <p className="text-green-400 text-sm text-center">All contributions are acknowledged and recorded in the sovereign ledger.</p>
          </div>
        </div>
      </section>

      {/* OTHER WAYS TO SUPPORT */}
      <section className="mt-10 pb-12">
        <h2 className="text-2xl text-[#B8860B] text-center mb-6" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>Other Ways to Support</h2>
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          <a href="https://mazsar.gumroad.com" target="_blank" rel="noopener" className="panel p-6 text-center hover:scale-[1.03] transition-all duration-300 block">
            <p className="text-2xl mb-2"></p>
            <p className="text-[#B8860B] font-bold">Buy Digital Products</p>
            <p className="text-zinc-500 text-sm mt-1">Gumroad Store</p>
          </a>
          <a href="https://www.amazon.co.uk/stores/Laszlo-Mazsar/author/B0DT3YJKQH" target="_blank" rel="noopener" className="panel p-6 text-center hover:scale-[1.03] transition-all duration-300 block">
            <p className="text-2xl mb-2"></p>
            <p className="text-[#B8860B] font-bold">Buy the Books</p>
            <p className="text-zinc-500 text-sm mt-1">Amazon Author Page</p>
          </a>
        </div>
      </section>

      {/* VISION STATEMENT */}
      <section className="panel p-8 mb-12 text-center max-w-2xl mx-auto border border-[#B8860B]/30">
        <p className="text-zinc-300 italic leading-relaxed">
          &ldquo;We are building the constitutional physics for autonomous intelligence. 
          Not to control AI, but to ensure it governs itself with the same integrity 
          we demand of sovereign nations. This is not charity — this is infrastructure 
          for the future.&rdquo;
        </p>
        <p className="text-[#B8860B] mt-4 text-sm tracking-widest" style={{ fontFamily: "'Cinzel', Georgia, serif" }}>— LASZLO MAZSAR, SOVEREIGN ARCHITECT</p>
      </section>
    </main>
  );
}
