import type { AgentId, AgentResult } from "@/types/agent";
import { sleep } from "@/lib/utils";

const MIN_DURATION_MS: Record<AgentId, number> = {
  "job-discovery": 900,
  "job-intelligence": 1300,
  "candidate-matching": 1600,
  outreach: 1400,
  "hiring-manager": 1500,
};

interface AgentComputeResult<T> {
  output: T;
  confidence: number;
  reasoningSummary: string;
}

/**
 * Runs an agent's compute function, measures real execution time, and pads
 * with a small floor delay so the Hermes timeline in the UI never flashes
 * a "Running..." state so briefly it reads as fake.
 */
export async function withTiming<T>(
  agentId: AgentId,
  compute: () => Promise<AgentComputeResult<T>>
): Promise<AgentResult<T>> {
  const start = performance.now();
  const result = await compute();
  const elapsed = performance.now() - start;

  const floor = MIN_DURATION_MS[agentId];
  if (elapsed < floor) {
    await sleep(floor - elapsed);
  }

  const executionTimeMs = Math.max(Math.round(performance.now() - start), floor);

  return {
    agentId,
    output: result.output,
    confidence: result.confidence,
    executionTimeMs,
    reasoningSummary: result.reasoningSummary,
  };
}
