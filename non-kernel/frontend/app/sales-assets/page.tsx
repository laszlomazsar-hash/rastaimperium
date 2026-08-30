import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Sales Assets — Approved Collateral",
  description:
    "Approved sales and institutional collateral for Rasta Imperium and EVO-V: blueprint, one-pagers, pitch outlines, and source materials.",
};

const sourceAssets = [
  "pitch-narrative-outline.md",
  "one-pager.md",
  "pricing-matrix.md",
  "objection-handling-notes.md",
  "deck-sections.md",
];

const exportAssets = [
  "pitch-narrative-outline.pdf",
  "pitch-narrative-outline.pptx",
  "one-pager.pdf",
  "one-pager.pptx",
  "pricing-matrix.pdf",
  "pricing-matrix.pptx",
  "objection-handling-notes.pdf",
  "objection-handling-notes.pptx",
  "deck-sections.pdf",
  "deck-sections.pptx",
];

const pdfUrl =
  "https://drive.google.com/file/d/1eodtfTSqO5BYfnsTM8fgcno6Nkmw1VHW/view?usp=drivesdk";

export default function SalesAssetsPage() {
  return (
    <main className="overflow-hidden">
      <section className="relative border-b border-[#B8860B]/20">
        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
          <div className="absolute left-[10%] top-0 h-72 w-72 rounded-full bg-[#107e3e]/10 blur-3xl" />
          <div className="absolute right-[8%] top-16 h-64 w-64 rounded-full bg-[#D4AF37]/10 blur-3xl" />
        </div>
        <div className="container-page relative py-20 lg:py-24">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#D4AF37]">Sales Assets</p>
          <h1 className="mt-6 max-w-3xl text-4xl leading-tight text-zinc-100 sm:text-5xl">
            Approved <span className="text-gold-gradient">collateral</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-zinc-300">
            Source-of-truth materials for institutional conversations. Request the latest revision or download
            approved exports below.
          </p>
        </div>
      </section>

      <section className="container-page py-12 lg:py-16">
        {/* Featured: Blueprint */}
        <div className="panel p-6 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">Featured</p>
              <h2 className="mt-2 text-2xl text-zinc-100">Sovereign AI Blueprint (EVO-V v9)</h2>
              <p className="mt-2 max-w-xl text-sm leading-7 text-zinc-400">
                21-page visual blueprint: Constitutional Computation, 9-layer stack, proof-carrying execution,
                and relational closure.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href="/blueprint"
                className="rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#F2D675]"
              >
                View on site
              </Link>
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg border border-zinc-600 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition hover:border-[#D4AF37]/70 hover:text-[#F2D675]"
              >
                Download PDF
              </a>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-xl text-gold">Editable source (Markdown)</h2>
            <ul className="mt-4 space-y-2">
              {sourceAssets.map((file) => (
                <li key={file}>
                  <a
                    href={`/sales-assets/source/${file}`}
                    download
                    className="block rounded-lg border border-[#B8860B]/20 bg-[#0b0c0b]/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-[#D4AF37]/40 hover:text-[#F2D675]"
                  >
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-xl text-gold">Binary exports (PDF / PPTX)</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Generate latest exports with <code className="text-zinc-400">bash docs/sales/build-exports.sh</code>
            </p>
            <ul className="mt-4 space-y-2">
              {exportAssets.map((file) => (
                <li key={file}>
                  <a
                    href={`/sales-assets/exports/${file}`}
                    download
                    className="block rounded-lg border border-[#B8860B]/20 bg-[#0b0c0b]/60 px-4 py-3 text-sm text-zinc-300 transition hover:border-[#D4AF37]/40 hover:text-[#F2D675]"
                  >
                    {file}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 rounded-xl border border-[#B8860B]/25 bg-[#0b0c0b]/80 p-6 text-center">
          <p className="text-zinc-300">Need a custom pack or latest revision?</p>
          <a
            href="mailto:sales@rastaimperium.com?subject=Collateral%20Request"
            className="mt-4 inline-block text-sm font-semibold text-[#F2D675] transition hover:text-white"
          >
            Email sales@rastaimperium.com →
          </a>
        </div>
      </section>
    </main>
  );
}
