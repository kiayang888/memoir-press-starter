
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MemoryPress — Memoirs & Books",
  description: "A gentle home for memoirs, family histories, and books."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50 text-neutral-800 antialiased">
        {children}
      </body>
    </html>
  );
}
