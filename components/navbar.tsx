import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/page-container";

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#09090b]/75 backdrop-blur-xl">
      <PageContainer className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-sm font-semibold tracking-[0.01em] text-white">
          <span className="flex size-7 items-center justify-center rounded-md bg-emerald-400 text-zinc-950"><Sparkles size={15} strokeWidth={2.5} /></span>
          Huntly
        </Link>
        <Link href="/demo" className="group flex items-center gap-1.5 text-sm font-medium text-zinc-300 transition-colors hover:text-white">
          Open demo <ArrowUpRight size={15} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </Link>
      </PageContainer>
    </header>
  );
}
