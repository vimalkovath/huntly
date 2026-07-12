"use client";

import { useCallback, useRef, useState } from "react";
import { AlertTriangle } from "lucide-react";
import type { AgentId, AgentResult, AgentStatus, HermesRunState } from "@/types/agent";
import { AGENT_ORDER, AGENT_DEFINITIONS } from "@/lib/hermes/agents/definitions";
import type { HermesEvent } from "@/lib/hermes/orchestrator";
import { JobInputPanel } from "./job-input-panel";
import { AgentCard } from "./agent-card";
import { ResultsPanel } from "./results-panel";
import { SAMPLE_JOB_DESCRIPTION } from "@/data/sample-job";

interface AgentUIState {
  status: AgentStatus;
  result: AgentResult | null;
}

function initialAgentStates(): Record<AgentId, AgentUIState> {
  return AGENT_ORDER.reduce((acc, id) => {
    acc[id] = { status: "idle", result: null };
    return acc;
  }, {} as Record<AgentId, AgentUIState>);
}

const EMPTY_RUN_STATE: HermesRunState = {
  jobDiscovery: null,
  jobIntelligence: null,
  candidateMatching: null,
  outreach: null,
  hiringManager: null,
};

export function HermesDemo() {
  const [jobText, setJobText] = useState(SAMPLE_JOB_DESCRIPTION);
  const [running, setRunning] = useState(false);
  const [agentStates, setAgentStates] = useState<Record<AgentId, AgentUIState>>(initialAgentStates);
  const [runState, setRunState] = useState<HermesRunState>(EMPTY_RUN_STATE);
  const [expandedAgent, setExpandedAgent] = useState<AgentId | null>(null);
  const [agentView, setAgentView] = useState<Record<AgentId, "json" | "reasoning">>(
    () =>
      AGENT_ORDER.reduce((acc, id) => {
        acc[id] = "reasoning";
        return acc;
      }, {} as Record<AgentId, "json" | "reasoning">)
  );
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const applyResultToRunState = useCallback((agentId: AgentId, result: AgentResult) => {
    setRunState((prev) => {
      const next = { ...prev };
      if (agentId === "job-discovery") next.jobDiscovery = result as HermesRunState["jobDiscovery"];
      if (agentId === "job-intelligence") next.jobIntelligence = result as HermesRunState["jobIntelligence"];
      if (agentId === "candidate-matching") next.candidateMatching = result as HermesRunState["candidateMatching"];
      if (agentId === "outreach") next.outreach = result as HermesRunState["outreach"];
      if (agentId === "hiring-manager") next.hiringManager = result as HermesRunState["hiringManager"];
      return next;
    });
  }, []);

  const runWorkflow = useCallback(async () => {
    if (!jobText.trim() || running) return;

    setRunning(true);
    setError(null);
    setAgentStates(initialAgentStates());
    setRunState(EMPTY_RUN_STATE);
    setExpandedAgent(null);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const res = await fetch("/api/hermes/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ jobDescription: jobText }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error("Hermes pipeline failed to start.");
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as HermesEvent;
          handleEvent(event);
        }
      }
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setError(err instanceof Error ? err.message : "Something went wrong running the Hermes pipeline.");
      }
    } finally {
      setRunning(false);
    }

    function handleEvent(event: HermesEvent) {
      if (event.type === "agent-start") {
        setAgentStates((prev) => ({
          ...prev,
          [event.agentId]: { status: "running", result: null },
        }));
      } else if (event.type === "agent-complete") {
        setAgentStates((prev) => ({
          ...prev,
          [event.agentId]: { status: "complete", result: event.result },
        }));
        applyResultToRunState(event.agentId, event.result);
        setExpandedAgent((prev) => prev ?? event.agentId);
      } else if (event.type === "agent-error") {
        setAgentStates((prev) => ({
          ...prev,
          [event.agentId]: { status: "error", result: null },
        }));
        setError(event.error);
      }
    }
  }, [jobText, running, applyResultToRunState]);

  return (
    <div className="grid gap-6 lg:grid-cols-[340px_1fr_400px] xl:grid-cols-[380px_1fr_440px]">
      <JobInputPanel
        value={jobText}
        onChange={setJobText}
        onRun={runWorkflow}
        running={running}
        disabled={false}
      />

      <div className="space-y-4">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
            Hermes execution timeline
          </h2>
        </div>

        {error && (
          <div className="flex items-center gap-2 rounded-xl border border-rose-400/30 bg-rose-400/10 p-3 text-sm text-rose-300">
            <AlertTriangle className="h-4 w-4 shrink-0" /> {error}
          </div>
        )}

        {AGENT_ORDER.map((id) => {
          const def = AGENT_DEFINITIONS[id];
          const state = agentStates[id];
          return (
            <AgentCard
              key={id}
              definition={def}
              status={state.status}
              confidence={state.result?.confidence ?? null}
              executionTimeMs={state.result?.executionTimeMs ?? null}
              reasoningSummary={state.result?.reasoningSummary ?? null}
              output={state.result?.output ?? null}
              expanded={expandedAgent === id}
              onToggle={() => setExpandedAgent((prev) => (prev === id ? null : id))}
              view={agentView[id]}
              onViewChange={(view) => setAgentView((prev) => ({ ...prev, [id]: view }))}
            />
          );
        })}
      </div>

      <ResultsPanel state={runState} />
    </div>
  );
}
