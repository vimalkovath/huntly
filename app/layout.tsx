import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Huntly | AI Recruiting Agency",
  description: "AI recruiting powered by collaborating specialist agents.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className="dark"><body>{children}</body></html>;
}
