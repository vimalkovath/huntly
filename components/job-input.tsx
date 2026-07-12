"use client";

import { Play } from "lucide-react";

export function JobInput() {
  return (
    <section className="surface flex min-h-[420px] flex-col rounded-lg p-5">
      <label htmlFor="job-description" className="text-sm font-medium text-zinc-200">Job Description</label>
      <textarea id="job-description" placeholder="Paste a job description here..." className="mt-4 min-h-64 flex-1 resize-none rounded-md border border-white/[0.08] bg-black/20 p-4 text-sm leading-6 text-zinc-200 outline-none placeholder:text-zinc-600 focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/10" />
      <button type="button" className="mt-4 inline-flex h-11 items-center justify-center gap-2 rounded-md bg-emerald-300 px-4 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200"><Play size={15} fill="currentColor" /> Run Hermes Workflow</button>
    </section>
  );
}
