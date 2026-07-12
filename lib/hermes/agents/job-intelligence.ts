import type { AgentResult, JobDiscoveryOutput, JobIntelligenceOutput } from "@/types/agent";
import { requestStructuredCompletion, jitter } from "@/lib/services/ai-provider";
import { AGENT_DEFINITIONS } from "./definitions";
import { withTiming } from "./run-timing";

const SKILL_LEXICON = [
  "SQL", "AI", "Product Strategy", "Marketplace", "Payments", "Fintech", "Growth",
  "Leadership", "Agentic Workflows", "LLM Orchestration", "Compliance", "Pricing",
  "Experimentation", "Roadmapping", "APIs", "Automation", "Recommendation Systems",
  "Trust & Safety", "Onboarding", "Risk Management",
];

function mockAnalyze(job: JobDiscoveryOutput): JobIntelligenceOutput {
  const text = job.normalizedDescription.toLowerCase();

  const found = SKILL_LEXICON.filter((skill) => text.includes(skill.toLowerCase()));
  const required = found.slice(0, Math.max(3, Math.ceil(found.length * 0.65))) ;
  const preferred = found.filter((s) => !required.includes(s));

  const yearsMatch = text.match(/(\d+)\+?\s*years?/);
  const experience = yearsMatch ? `${yearsMatch[1]}+ years` : "4-6 years";

  const seniorityMatch = /(senior|staff|lead|principal|director|head)/i.exec(job.title);
  const seniority = seniorityMatch ? seniorityMatch[1] : "Mid-level";

  const employmentType = /contract|freelance/i.test(text) ? "Contract" : "Full-time";

  const industryGuess =
    /fintech|payments|banking/i.test(text) ? "Fintech" :
    /marketplace|e-commerce|retail/i.test(text) ? "E-commerce" :
    /health/i.test(text) ? "Healthtech" :
    "Enterprise Software";

  const risks: string[] = [];
  if (required.length < 3) {
    risks.push("Job description under-specifies required skills; matching confidence may be lower.");
  }
  if (/(10\+|12\+|15\+)\s*years?/.test(text)) {
    risks.push("Very senior experience bar will narrow the candidate pool significantly.");
  }
  if (!/remote|hybrid/i.test(text) && job.location !== "Not specified") {
    risks.push(`On-site expectation in ${job.location} may limit reach outside that metro.`);
  }
  if (risks.length === 0) {
    risks.push("No major sourcing risks detected; role is well-scoped and broadly matchable.");
  }

  return {
    requiredSkills: required.length ? required : ["Product Strategy", "SQL", "Stakeholder Management"],
    preferredSkills: preferred.length ? preferred : ["AI"],
    experience,
    industry: industryGuess,
    employmentType,
    seniority,
    risks,
  };
}

export async function runJobIntelligenceAgent(job: JobDiscoveryOutput): Promise<AgentResult<JobIntelligenceOutput>> {
  const def = AGENT_DEFINITIONS["job-intelligence"];

  return withTiming("job-intelligence", async () => {
    const structured = await requestStructuredCompletion<JobIntelligenceOutput>({
      system: `${def.soul}\nReturn strictly JSON with keys: requiredSkills, preferredSkills, experience, industry, employmentType, seniority, risks.`,
      prompt: `Normalized job:\n${JSON.stringify(job, null, 2)}`,
    });

    const output = structured ?? mockAnalyze(job);

    const reasoningSummary = `Extracted ${output.requiredSkills.length} required and ${output.preferredSkills.length} preferred skills, inferred a ${output.experience} bar, and flagged ${output.risks.length} hiring risk${output.risks.length === 1 ? "" : "s"} for the sourcer to watch.`;

    return {
      output,
      confidence: jitter(91, 4) / 100,
      reasoningSummary,
    };
  });
}
