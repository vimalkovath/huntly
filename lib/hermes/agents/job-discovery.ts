import type { AgentResult, JobDiscoveryOutput } from "@/types/agent";
import { requestStructuredCompletion, jitter } from "@/lib/services/ai-provider";
import { AGENT_DEFINITIONS } from "./definitions";
import { withTiming } from "./run-timing";

function mockNormalize(raw: string): JobDiscoveryOutput {
  const lines = raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);

  const titleGuess =
    lines.find((l) => /manager|engineer|designer|analyst|lead|director|recruiter/i.test(l))?.slice(0, 80) ??
    "Untitled Role";

  const companyLine = lines.find((l) => /^(at|company)[:\s]/i.test(l));
  const company = companyLine
    ? companyLine.replace(/^(at|company)[:\s]/i, "").trim()
    : "Unspecified Company";

  const locationLine = lines.find((l) => /remote|bengaluru|new york|san francisco|london|singapore|dubai|hybrid|on-site|onsite/i.test(l));
  const location = locationLine ? locationLine.slice(0, 60) : "Not specified";

  const normalizedDescription = lines.join(" ").replace(/\s{2,}/g, " ").slice(0, 1200);

  return {
    title: titleGuess.replace(/[-–:]\s*$/, "").trim(),
    company: company.slice(0, 60),
    location,
    normalizedDescription,
  };
}

export async function runJobDiscoveryAgent(rawDescription: string): Promise<AgentResult<JobDiscoveryOutput>> {
  const def = AGENT_DEFINITIONS["job-discovery"];

  return withTiming("job-discovery", async () => {
    const structured = await requestStructuredCompletion<JobDiscoveryOutput>({
      system: `${def.soul}\nReturn strictly JSON with keys: title, company, location, normalizedDescription.`,
      prompt: `Raw job description:\n\n${rawDescription}`,
    });

    const output = structured ?? mockNormalize(rawDescription);

    const reasoningSummary = `Parsed the pasted listing, isolated the role title, company, and location, and normalized the body copy into clean prose for downstream agents.`;

    return {
      output,
      confidence: jitter(96, 2) / 100,
      reasoningSummary,
    };
  });
}
