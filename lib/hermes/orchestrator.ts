import type { AgentId, AgentResult, HermesRunState } from "@/types/agent";
import { runJobDiscoveryAgent } from "./agents/job-discovery";
import { runJobIntelligenceAgent } from "./agents/job-intelligence";
import { runCandidateMatchingAgent } from "./agents/candidate-matching";
import { runOutreachAgent } from "./agents/outreach";
import { runHiringManagerAgent } from "./agents/hiring-manager";
import { AGENT_ORDER } from "./agents/definitions";

export type HermesEvent =
  | { type: "agent-start"; agentId: AgentId }
  | { type: "agent-complete"; agentId: AgentId; result: AgentResult }
  | { type: "agent-error"; agentId: AgentId; error: string }
  | { type: "run-complete"; state: HermesRunState };

/**
 * Orchestrates the five Huntly agents end-to-end, exactly like a recruiting
 * agency handoff: each agent's structured output becomes the next agent's
 * input. Yields events as an async generator so the API route can stream
 * live progress to the UI instead of waiting on the full pipeline.
 */
export async function* runHermesPipeline(rawJobDescription: string): AsyncGenerator<HermesEvent> {
  const state: HermesRunState = {
    jobDiscovery: null,
    jobIntelligence: null,
    candidateMatching: null,
    outreach: null,
    hiringManager: null,
  };

  try {
    yield { type: "agent-start", agentId: "job-discovery" };
    const jobDiscovery = await runJobDiscoveryAgent(rawJobDescription);
    state.jobDiscovery = jobDiscovery;
    yield { type: "agent-complete", agentId: "job-discovery", result: jobDiscovery };

    yield { type: "agent-start", agentId: "job-intelligence" };
    const jobIntelligence = await runJobIntelligenceAgent(jobDiscovery.output);
    state.jobIntelligence = jobIntelligence;
    yield { type: "agent-complete", agentId: "job-intelligence", result: jobIntelligence };

    yield { type: "agent-start", agentId: "candidate-matching" };
    const candidateMatching = await runCandidateMatchingAgent(jobDiscovery.output, jobIntelligence.output);
    state.candidateMatching = candidateMatching;
    yield { type: "agent-complete", agentId: "candidate-matching", result: candidateMatching };

    yield { type: "agent-start", agentId: "outreach" };
    const outreach = await runOutreachAgent(jobDiscovery.output, jobIntelligence.output, candidateMatching.output);
    state.outreach = outreach;
    yield { type: "agent-complete", agentId: "outreach", result: outreach };

    yield { type: "agent-start", agentId: "hiring-manager" };
    const hiringManager = await runHiringManagerAgent(
      jobDiscovery.output,
      jobIntelligence.output,
      candidateMatching.output
    );
    state.hiringManager = hiringManager;
    yield { type: "agent-complete", agentId: "hiring-manager", result: hiringManager };

    yield { type: "run-complete", state };
  } catch (err) {
    const failedAgent = AGENT_ORDER.find((id) => !state[toStateKey(id)]) ?? "job-discovery";
    yield {
      type: "agent-error",
      agentId: failedAgent,
      error: err instanceof Error ? err.message : "Unknown error running Hermes pipeline.",
    };
  }
}

function toStateKey(id: AgentId): keyof HermesRunState {
  const map: Record<AgentId, keyof HermesRunState> = {
    "job-discovery": "jobDiscovery",
    "job-intelligence": "jobIntelligence",
    "candidate-matching": "candidateMatching",
    outreach: "outreach",
    "hiring-manager": "hiringManager",
  };
  return map[id];
}
