import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI",
    template: "%s | Rasta Imperium",
  },
  description: "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.",
  keywords: ["constitutional AI", "deterministic governance", "sovereign AI", "neurosymbolic", "EVO-V", "AI safety", "replay engine", "epistemic governance"],
  authors: [{ name: "Laszlo Mazsar" }],
  creator: "Rasta Imperium",
  metadataBase: new URL("https://rastaimperium.com"),
  openGraph: { type: "website", locale: "en_GB", url: "https://rastaimperium.com", siteName: "Rasta Imperium", title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI", description: "Constitutional intelligence systems enforcing epistemic integrity across autonomous infrastructures. Replayable. Auditable. Sovereign.", images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Rasta Imperium — Constitutional Intelligence Infrastructure" }] },
  twitter: { card: "summary_large_image", title: "Rasta Imperium — Deterministic Governance for Civilization-Scale AI", description: "Replayable. Auditable. Sovereign. Constitutional AI governance.", images: ["/og-image.png"] },
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/icon.png", type: "image/png", sizes: "192x192" }] },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <Script async src="https://plausible.io/js/pa-gk0L-J_xecv-BrP67xDRE.js" strategy="afterInteractive" />
        <Script id="plausible-init" strategy="afterInteractive">{`window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)};plausible.init=plausible.init||function(i){plausible.o=i||{}};plausible.init();`}</Script>
      </head>
      <body className="text-zinc-100">
        {children}
        <footer className="border-t border-[#B8860B]/20 py-12" style={{ background: 'rgba(10,10,10,0.9)' }}>
          <div className="mx-auto max-w-6xl px-4 text-center">
            <p className="text-[#B8860B] text-lg tracking-widest">THE RASTA IMPERIUM</p>
            <p className="text-zinc-500 text-sm mt-3 tracking-wide">Sovereign AI Architecture · Constitutional Intelligence · England</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
