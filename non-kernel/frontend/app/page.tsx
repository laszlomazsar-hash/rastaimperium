import type { Metadata } from "next";
import Link from "next/link";
// RESTORE_MARKER - full content must follow from home_final2
export default function HomePage() {
  return (
    <main className="royal-page overflow-hidden">
      <section className="container-page py-20">
        <h1 className="font-cinzel text-4xl text-zinc-100">Do not trust the claim. Inspect the evidence.</h1>
        <p className="mt-4 text-zinc-400">Homepage restore incomplete — full content required.</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/verify/" className="rounded-lg bg-[#D4AF37] px-6 py-3 text-sm font-bold text-black">Verify the evidence</Link>
          <Link href="/institutional-pilots/" className="rounded-lg border border-[#B8860B]/40 px-6 py-3 text-sm text-[#F2D675]">Evaluate a pilot pathway</Link>
          <Link href="/contact/?intent=institutional" className="rounded-lg border border-zinc-600 px-6 py-3 text-sm text-zinc-100">Contact Rasta Imperium</Link>
          <Link href="/limitations/" className="text-sm text-zinc-500">Read Limitations first →</Link>
        </div>
      </section>
    </main>
  );
}
