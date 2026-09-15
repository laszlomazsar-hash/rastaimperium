import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

/**
 * Recovery-oriented 404 — same system language, no invented routes.
 */
export default function NotFound() {
  return (
    <main className="royal-page min-h-[60vh]">
      <div className="container-page py-16 sm:py-24">
        <p className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]">
          Navigation recovery
        </p>
        <h1 className="mt-3 font-cinzel text-3xl text-zinc-100 sm:text-4xl">
          This path is not on the public surface.
        </h1>
        <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400">
          The URL may be mistyped, retired, or outside the constitutional verification layer.
          Use the routes below to return to evidence, verification, or institutional contact.
        </p>

        <nav aria-label="Recovery" className="mt-10">
          <ul className="flex flex-wrap gap-3">
            <li>
              <Link
                href="/"
                className="royal-button royal-button-primary inline-block rounded-lg bg-[#D4AF37] px-5 py-2.5 text-sm font-bold text-black transition hover:bg-[#F2D675]"
              >
                Return to Imperium
              </Link>
            </li>
            <li>
              <Link
                href="/observatory/"
                className="inline-block rounded-lg border border-[#B8860B]/45 px-5 py-2.5 text-sm font-semibold text-[#F2D675] transition hover:border-[#F2D675]"
              >
                Explore Evidence
              </Link>
            </li>
            <li>
              <Link
                href="/verify/"
                className="inline-block rounded-lg border border-[#B8860B]/45 px-5 py-2.5 text-sm font-semibold text-[#F2D675] transition hover:border-[#F2D675]"
              >
                Verify
              </Link>
            </li>
            <li>
              <Link
                href="/blueprint/"
                className="inline-block rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-[#D4AF37]/60"
              >
                Architecture
              </Link>
            </li>
            <li>
              <Link
                href="/contact/"
                className="inline-block rounded-lg border border-zinc-700 px-5 py-2.5 text-sm font-semibold text-zinc-200 transition hover:border-[#D4AF37]/60"
              >
                Contact
              </Link>
            </li>
          </ul>
        </nav>

        <p className="mt-10 text-xs text-zinc-600">
          Prefer the full public atlas?{" "}
          <Link href="/explore/" className="text-zinc-500 underline hover:text-[#F2D675]">
            Explore →
          </Link>
        </p>
      </div>
    </main>
  );
}
