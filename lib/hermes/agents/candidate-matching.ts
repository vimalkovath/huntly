import type {
  AgentResult,
  CandidateMatchingOutput,
  JobDiscoveryOutput,
  JobIntelligenceOutput,
} from "@/types/agent";
import { jitter } from "@/lib/services/ai-provider";
import { candidates } from "@/data/candidates";
import { rankCandidates } from "@/lib/services/scoring";
import { withTiming } from "./run-timing";

/**
 * Candidate Matching intentionally does NOT call an LLM or an embeddings
 * model. Per the Huntly brief this agent uses transparent weighted scoring
 * over a mock candidate dataset so every ranking is explainable.
 */
export async function runCandidateMatchingAgent(
  job: JobDiscoveryOutput,
  intel: JobIntelligenceOutput
): Promise<AgentResult<CandidateMatchingOutput>> {
  return withTiming("candidate-matching", async () => {
    const output = rankCandidates(candidates, job, intel, 5);

    const reasoningSummary = `Scored all ${candidates.length} candidates in the pool against required/preferred skills, experience band, industry fit, and location, then returned the top ${output.length} by weighted score (top match: ${output[0]?.score ?? 0}%).`;

    return {
      output,
      confidence: jitter(94, 2) / 100,
      reasoningSummary,
    };
  });
}
