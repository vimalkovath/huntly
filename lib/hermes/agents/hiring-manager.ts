import type {
  AgentResult,
  CandidateMatchingOutput,
  HiringManagerOutput,
  JobDiscoveryOutput,
  JobIntelligenceOutput,
} from "@/types/agent";
import { requestStructuredCompletion, jitter } from "@/lib/services/ai-provider";
import { candidates } from "@/data/candidates";
import { AGENT_DEFINITIONS } from "./definitions";
import { withTiming } from "./run-timing";

function mockReview(
  job: JobDiscoveryOutput,
  intel: JobIntelligenceOutput,
  matches: CandidateMatchingOutput
): HiringManagerOutput {
  const top = matches[0];
  const candidate = candidates.find((c) => c.id === top?.candidateId);

  const recommendation =
    top && top.score >= 85
      ? `Proceed to interview with ${candidate?.name ?? "the top candidate"} immediately — strong fit across skills and experience.`
      : top && top.score >= 70
      ? `Proceed cautiously with ${candidate?.name ?? "the top candidate"} — solid fit, but confirm the gaps below in screen.`
      : `Shortlist is workable but no standout match yet; consider widening sourcing criteria.`;

  const interviewQuestions = [
    top?.missingSkills.length
      ? `Walk me through a project where you had to pick up ${top.missingSkills[0]} quickly.`
      : `Walk me through the hiring decision you're most proud of that used ${intel.requiredSkills[0] ?? "your core skillset"}.`,
    `Tell me about a time you shipped in ${intel.industry} under a tight deadline — what tradeoffs did you make?`,
    `How would you approach the first 30 days in a ${job.title} role at a company like ${job.company}?`,
  ];

  const risks = [...intel.risks];
  if (top && top.score < 80) {
    risks.push("Top match score is below 80% — validate must-have skills before extending an offer.");
  }

  const summary = `Reviewed ${matches.length} shortlisted candidates against the ${job.title} requirements. ${
    candidate ? `${candidate.name} leads at ${top?.score}% fit` : "No clear leader emerged"
  }, driven primarily by skills and experience alignment. ${risks.length} risk${risks.length === 1 ? "" : "s"} noted for hiring team review.`;

  return {
    recommendation,
    confidence: top ? Math.min(0.97, top.score / 100 + 0.03) : 0.6,
    interviewQuestions,
    risks,
    summary,
  };
}

export async function runHiringManagerAgent(
  job: JobDiscoveryOutput,
  intel: JobIntelligenceOutput,
  matches: CandidateMatchingOutput
): Promise<AgentResult<HiringManagerOutput>> {
  const def = AGENT_DEFINITIONS["hiring-manager"];

  return withTiming("hiring-manager", async () => {
    const structured = await requestStructuredCompletion<HiringManagerOutput>({
      system: `${def.soul}\nReturn strictly JSON with keys: recommendation, confidence (0-1), interviewQuestions (array), risks (array), summary.`,
      prompt: `Job: ${JSON.stringify(job)}\nRequirements: ${JSON.stringify(intel)}\nShortlist: ${JSON.stringify(matches)}`,
    });

    const output = structured ?? mockReview(job, intel, matches);

    const reasoningSummary = `Weighed the sourcer's confidence against hiring risk, drafted ${output.interviewQuestions.length} targeted interview questions, and issued a final recommendation.`;

    return {
      output,
      confidence: jitter(Math.round(output.confidence * 100), 2) / 100,
      reasoningSummary,
    };
  });
}
