"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { PageContainer } from "@/components/page-container";

export function Hero() {
  return (
    <main className="relative isolate overflow-hidden bg-hero-glow">
      <div className="grid-background absolute inset-x-0 top-0 h-[38rem] -z-10" />
      <PageContainer className="flex min-h-[calc(100vh-4rem)] flex-col justify-center py-24 sm:py-32">
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} className="max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-emerald-300/15 bg-emerald-300/[0.07] px-3 py-1.5 text-xs font-medium text-emerald-200">
            <Sparkles size={13} /> AI recruiting, rethought
          </div>
          <h1 className="max-w-3xl text-5xl font-semibold leading-[1.04] tracking-tight text-white sm:text-7xl">What if your next hire found itself?</h1>
          <p className="mt-7 max-w-2xl text-base leading-7 text-zinc-400 sm:text-lg">Huntly is an AI Recruiting Agency powered by Hermes. Specialized AI agents collaborate to understand jobs, evaluate candidates, generate outreach, and recommend hiring decisions.</p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link href="/demo" className="inline-flex h-11 items-center gap-2 rounded-lg bg-emerald-300 px-5 text-sm font-semibold text-zinc-950 transition-transform hover:-translate-y-0.5 hover:bg-emerald-200"><span>Run Demo</span><ArrowRight size={16} /></Link>
            <button disabled className="h-11 rounded-lg border border-white/[0.12] bg-white/[0.03] px-5 text-sm font-medium text-zinc-500" type="button">Join Waitlist</button>
          </div>
        </motion.div>
        <div className="mt-20 flex items-center gap-3 text-xs text-zinc-600"><span className="h-px w-10 bg-zinc-700" /> Multi-agent hiring intelligence</div>
      </PageContainer>
    </main>
  );
}
