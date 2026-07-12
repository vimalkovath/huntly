import type {
  AgentResult,
  CandidateMatchingOutput,
  JobDiscoveryOutput,
  JobIntelligenceOutput,
  OutreachOutput,
} from "@/types/agent";
import { requestStructuredCompletion, jitter } from "@/lib/services/ai-provider";
import { candidates } from "@/data/candidates";
import { AGENT_DEFINITIONS } from "./definitions";
import { withTiming } from "./run-timing";

function mockOutreach(
  job: JobDiscoveryOutput,
  intel: JobIntelligenceOutput,
  matches: CandidateMatchingOutput
): OutreachOutput {
  const top = matches[0];
  const candidate = candidates.find((c) => c.id === top?.candidateId);
  const firstName = candidate?.name.split(" ")[0] ?? "there";

  const recruiterEmail = {
    subject: `Top 5 candidates ready for ${job.title}`,
    body:
      `Hi team,\n\n` +
      `Huntly's agents finished sourcing for the ${job.title} role at ${job.company}. ` +
      `${matches.length} candidates made the shortlist, led by ${candidate?.name ?? "our top match"} ` +
      `at ${top ? top.score : "--"}% fit${candidate ? ` (${candidate.title} at ${candidate.company})` : ""}.\n\n` +
      `Required skills we filtered on: ${intel.requiredSkills.join(", ")}.\n\n` +
      `Full breakdown with reasoning is in the Huntly dashboard. Let me know who you'd like to move to outreach first.\n\n` +
      `— Huntly`,
  };

  const candidateEmail = {
    subject: `${firstName}, does ${job.title} at ${job.company} sound interesting?`,
    body:
      `Hi ${firstName},\n\n` +
      `I came across your background${candidate ? ` at ${candidate.company}` : ""} and thought you'd be a strong fit for our ${job.title} opening` +
      `${job.company !== "Unspecified Company" ? ` at ${job.company}` : ""}.\n\n` +
      `${candidate && top?.matchedSkills.length ? `Your experience with ${top.matchedSkills.slice(0, 3).join(", ")} lines up closely with what we need.` : "Your experience lines up closely with what we need."}\n\n` +
      `Would you be open to a short call this week to hear more? No pressure either way — happy to share more details first if that's easier.\n\n` +
      `Best,\nHuntly Recruiting`,
  };

  return { recruiterEmail, candidateEmail };
}

export async function runOutreachAgent(
  job: JobDiscoveryOutput,
  intel: JobIntelligenceOutput,
  matches: CandidateMatchingOutput
): Promise<AgentResult<OutreachOutput>> {
  const def = AGENT_DEFINITIONS.outreach;

  return withTiming("outreach", async () => {
    const structured = await requestStructuredCompletion<OutreachOutput>({
      system: `${def.soul}\nReturn strictly JSON with keys: recruiterEmail {subject, body}, candidateEmail {subject, body}.`,
      prompt: `Job: ${JSON.stringify(job)}\nRequirements: ${JSON.stringify(intel)}\nTop candidate match: ${JSON.stringify(matches[0])}`,
    });

    const output = structured ?? mockOutreach(job, intel, matches);

    const reasoningSummary = `Drafted a recruiter summary email highlighting the top candidate, and a personalized outreach email referencing specific matched skills to maximize response rate.`;

    return {
      output,
      confidence: jitter(90, 3) / 100,
      reasoningSummary,
    };
  });
}
