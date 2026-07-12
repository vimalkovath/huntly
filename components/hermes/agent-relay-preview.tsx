"use client";

import { motion } from "framer-motion";
import { AGENT_ORDER, AGENT_DEFINITIONS } from "@/lib/hermes/agents/definitions";
import { AGENT_ICONS } from "./agent-icons";

const STEP_DURATION = 1.1;
const TOTAL = AGENT_ORDER.length * STEP_DURATION;

export function AgentRelayPreview() {
  return (
    <div className="glass relative overflow-hidden rounded-2xl p-6">
      <div className="mb-5 flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
          Hermes · live pipeline
        </span>
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" />
      </div>

      <div className="relative flex items-center justify-between">
        <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-white/10" />
        <motion.div
          className="absolute left-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-violet-500 to-cyan-400"
          initial={{ width: "0%" }}
          animate={{ width: ["0%", "100%"] }}
          transition={{ duration: TOTAL, repeat: Infinity, ease: "linear" }}
          style={{ right: "5%" }}
        />

        {AGENT_ORDER.map((id, i) => {
          const Icon = AGENT_ICONS[id];
          const delay = i * STEP_DURATION;
          return (
            <div key={id} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[var(--color-bg-elevated)]"
                animate={{
                  borderColor: [
                    "rgba(255,255,255,0.1)",
                    "rgba(124,92,255,0.8)",
                    "rgba(52,211,153,0.8)",
                    "rgba(255,255,255,0.1)",
                  ],
                  scale: [1, 1.12, 1.04, 1],
                }}
                transition={{ duration: TOTAL, repeat: Infinity, times: [0, 0.15, 0.35, 1], delay: delay - i * 0.001 }}
              >
                <Icon className="h-4 w-4 text-white" />
              </motion.div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 grid grid-cols-5 gap-1 text-center">
        {AGENT_ORDER.map((id) => (
          <span key={id} className="truncate font-mono text-[10px] text-[var(--color-text-muted)]">
            {AGENT_DEFINITIONS[id].name.replace(" Agent", "")}
          </span>
        ))}
      </div>
    </div>
  );
}
