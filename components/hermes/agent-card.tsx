"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Loader2, Check, AlertTriangle, Circle } from "lucide-react";
import type { AgentDefinition, AgentStatus } from "@/types/agent";
import { AGENT_ICONS } from "./agent-icons";
import { formatMs } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface AgentCardProps {
  definition: AgentDefinition;
  status: AgentStatus;
  confidence: number | null;
  executionTimeMs: number | null;
  reasoningSummary: string | null;
  output: unknown;
  expanded: boolean;
  onToggle: () => void;
  view: "json" | "reasoning";
  onViewChange: (view: "json" | "reasoning") => void;
}

const STATUS_STYLES: Record<AgentStatus, string> = {
  idle: "border-white/8",
  queued: "border-white/10",
  running: "border-amber-400/50 shadow-[0_0_0_1px_rgba(245,184,65,0.15),0_0_24px_-8px_rgba(245,184,65,0.5)]",
  complete: "border-emerald-400/40",
  error: "border-rose-400/50",
};

export function AgentCard({
  definition,
  status,
  confidence,
  executionTimeMs,
  reasoningSummary,
  output,
  expanded,
  onToggle,
  view,
  onViewChange,
}: AgentCardProps) {
  const Icon = AGENT_ICONS[definition.id];

  return (
    <motion.div
      layout
      className={cn("glass rounded-2xl border transition-colors duration-300", STATUS_STYLES[status])}
    >
      <button
        type="button"
        onClick={onToggle}
        disabled={status === "idle" || status === "queued"}
        className="flex w-full items-center gap-4 p-4 text-left disabled:cursor-default"
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/5",
            status === "running" && "bg-amber-400/10",
            status === "complete" && "bg-emerald-400/10",
            status === "error" && "bg-rose-400/10"
          )}
        >
          <Icon className="h-4.5 w-4.5 text-white" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-display text-sm font-semibold text-white">{definition.name}</span>
            <StatusPill status={status} />
          </div>
          <p className="mt-0.5 truncate text-xs text-[var(--color-text-muted)]">{definition.role}</p>
        </div>

        <div className="hidden shrink-0 items-center gap-4 sm:flex">
          {confidence !== null && (
            <div className="text-right">
              <div className="font-mono text-sm text-white">{Math.round(confidence * 100)}%</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">confidence</div>
            </div>
          )}
          {executionTimeMs !== null && (
            <div className="text-right">
              <div className="font-mono text-sm text-white">{formatMs(executionTimeMs)}</div>
              <div className="text-[10px] uppercase tracking-wide text-[var(--color-text-muted)]">runtime</div>
            </div>
          )}
        </div>

        {(status === "complete" || status === "error") && (
          <ChevronDown className={cn("h-4 w-4 text-[var(--color-text-muted)] transition-transform", expanded && "rotate-180")} />
        )}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (status === "complete" || status === "error") && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/8 px-4 py-4">
              <div className="mb-3 flex gap-1 rounded-lg bg-black/30 p-1 text-xs">
                <button
                  onClick={() => onViewChange("reasoning")}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 transition",
                    view === "reasoning" ? "bg-white/10 text-white" : "text-[var(--color-text-muted)]"
                  )}
                >
                  Reasoning
                </button>
                <button
                  onClick={() => onViewChange("json")}
                  className={cn(
                    "flex-1 rounded-md px-3 py-1.5 transition",
                    view === "json" ? "bg-white/10 text-white" : "text-[var(--color-text-muted)]"
                  )}
                >
                  View JSON
                </button>
              </div>

              {view === "reasoning" ? (
                <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{reasoningSummary}</p>
              ) : (
                <pre className="scroll-thin max-h-64 overflow-auto rounded-lg bg-black/40 p-3 font-mono text-[11px] leading-relaxed text-cyan-200">
                  {JSON.stringify(output, null, 2)}
                </pre>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function StatusPill({ status }: { status: AgentStatus }) {
  if (status === "running") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-amber-400/10 px-2 py-0.5 text-[10px] font-medium text-amber-300">
        <Loader2 className="h-2.5 w-2.5 animate-spin" /> Running
      </span>
    );
  }
  if (status === "complete") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-emerald-400/10 px-2 py-0.5 text-[10px] font-medium text-emerald-300">
        <Check className="h-2.5 w-2.5" /> Complete
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className="flex items-center gap-1 rounded-full bg-rose-400/10 px-2 py-0.5 text-[10px] font-medium text-rose-300">
        <AlertTriangle className="h-2.5 w-2.5" /> Error
      </span>
    );
  }
  return (
    <span className="flex items-center gap-1 rounded-full bg-white/5 px-2 py-0.5 text-[10px] font-medium text-[var(--color-text-muted)]">
      <Circle className="h-2 w-2" /> Idle
    </span>
  );
}
