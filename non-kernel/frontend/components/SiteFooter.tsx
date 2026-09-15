import Link from "next/link";
import RISeal from "./RISeal";
import { NAV_GROUPS, EXTERNAL_LINKS, type NavLink } from "./nav-config";

/**
 * Site footer — presentation only.
 * Navigation structure is derived from nav-config (same source as SiteHeader).
 */

/** Footer column order (presentation preference; data still from NAV_GROUPS). */
const FOOTER_GROUP_ORDER = [
  "understand",
  "evidence",
  "verify",
  "architecture",
  "codex",
  "about",
] as const;

function FooterLink({ item }: { item: NavLink }) {
  const className = "transition hover:text-[#F2D675]";
  if (item.external) {
    return (
      <li>
        <a className={className} href={item.href} target="_blank" rel="noreferrer">
          {item.label}
        </a>
      </li>
    );
  }
  return (
    <li>
      <Link className={className} href={item.href}>
        {item.label}
      </Link>
    </li>
  );
}

export default function SiteFooter() {
  const groups = FOOTER_GROUP_ORDER.map((id) =>
    NAV_GROUPS.find((g) => g.id === id)
  ).filter(Boolean);

  return (
    <footer className="royal-footer border-t border-[rgba(242,214,117,0.18)] bg-[#090a09] py-12 sm:py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-xl">
          <Link
            href="/"
            className="inline-flex items-center transition hover:opacity-90"
            aria-label="Rasta Imperium home"
          >
            <RISeal size={32} showWordmark />
          </Link>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.28em] text-[#d4af37]/80">
            Identity · Witness · Verification
          </p>
          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Constitutional intelligence infrastructure. Deterministic governance,
            verifiable evidence, accountable autonomy.
          </p>
        </div>

        <div className="grid gap-10 text-sm sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {groups.map((group) => {
            if (!group) return null;
            return (
              <div key={group.id}>
                <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.22em] text-[#B8860B]">
                  {group.label}
                </p>
                <ul className="mt-4 space-y-2.5 text-zinc-400">
                  {group.items.map((item) => (
                    <FooterLink key={item.href + item.label} item={item} />
                  ))}
                  {group.id === "about" && (
                    <li>
                      <Link className="transition hover:text-[#F2D675]" href="/explore/">
                        Full atlas
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-zinc-900 pt-6 text-sm text-zinc-500">
          {EXTERNAL_LINKS.map((link, i) => (
            <span key={link.href} className="inline-flex items-center gap-x-4">
              {i > 0 && (
                <span className="text-zinc-700" aria-hidden="true">
                  ·
                </span>
              )}
              <a
                className="transition hover:text-[#F2D675]"
                href={link.href}
                target="_blank"
                rel="noreferrer"
              >
                {link.label}
              </a>
            </span>
          ))}
        </div>

        <div className="mt-6">
          <p className="text-xs leading-6 text-zinc-600">
            Rasta Imperium is the public constitutional and verification layer — not the EVO-V
            execution runtime. Unproven claims are labelled; see{" "}
            <Link href="/limitations/" className="text-zinc-500 underline hover:text-[#F2D675]">
              Limitations
            </Link>
            . Wider public surfaces are indexed under{" "}
            <Link href="/explore/" className="text-zinc-500 underline hover:text-[#F2D675]">
              Explore
            </Link>
            .
          </p>
        </div>
      </div>
    </footer>
  );
}
