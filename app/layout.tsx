import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rasta Imperium",
  description: "A Next.js App Router site configured for static export."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
