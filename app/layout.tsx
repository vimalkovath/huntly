import type { Metadata } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Huntly — The AI Recruiting Agency",
  description:
    "Huntly replaces the traditional recruiting workflow with a team of specialized Hermes agents that source, score, and reach out to candidates end-to-end.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}

function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/5 bg-black/30 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-violet-500 to-cyan-400">
            <span className="h-2.5 w-2.5 rounded-sm bg-black/80" />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight">Huntly</span>
        </Link>
        <nav className="hidden items-center gap-8 text-sm text-[var(--color-text-secondary)] sm:flex">
          <Link href="/#how-it-works" className="transition hover:text-white">
            How it works
          </Link>
          <Link href="/#agents" className="transition hover:text-white">
            Agents
          </Link>
          <Link href="/waitlist" className="transition hover:text-white">
            Waitlist
          </Link>
        </nav>
        <Link
          href="/demo"
          className="rounded-full bg-gradient-to-r from-violet-500 to-cyan-400 px-4 py-2 text-sm font-medium text-black transition hover:opacity-90"
        >
          Run the demo
        </Link>
      </div>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-white/5 py-10">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 text-sm text-[var(--color-text-muted)] sm:flex-row">
        <p>Built for the Hermes Buildathon.</p>
        <p>© {new Date().getFullYear()} Huntly. Not a real recruiting agency — yet.</p>
      </div>
    </footer>
  );
}
