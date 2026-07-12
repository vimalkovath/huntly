"use client";

import { motion } from "framer-motion";
import { BriefcaseBusiness, CircleDashed, Mail, SearchCheck, Sparkles, UsersRound } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { WorkflowIcon, WorkflowStep } from "@/types/workflow";

const workflowIcons: Record<WorkflowIcon, LucideIcon> = {
  briefcase: BriefcaseBusiness,
  sparkles: Sparkles,
  search: SearchCheck,
  mail: Mail,
  users: UsersRound,
};

export function WorkflowCard({ step }: { step: WorkflowStep }) {
  const Icon = workflowIcons[step.icon];
  return (
    <motion.article whileHover={{ y: -2 }} transition={{ duration: 0.18 }} className="group rounded-lg border border-white/[0.08] bg-white/[0.025] p-4 shadow-lg shadow-black/10 transition-colors hover:border-white/[0.15] hover:bg-white/[0.045]">
      <div className="flex items-start gap-3">
        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border border-white/[0.08] bg-zinc-900 text-zinc-300 group-hover:text-emerald-200"><Icon size={17} /></span>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2"><h3 className="text-sm font-medium text-zinc-200">{step.title}</h3><span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-zinc-700/70 bg-zinc-800/70 px-2 py-0.5 text-[11px] font-medium text-zinc-400"><CircleDashed size={11} />{step.status}</span></div>
          <p className="mt-1 text-xs leading-5 text-zinc-500">{step.description}</p>
        </div>
      </div>
    </motion.article>
  );
}
