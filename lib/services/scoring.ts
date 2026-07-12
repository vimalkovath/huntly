import type { Candidate } from "@/types/candidate";
import type { CandidateMatch, JobIntelligenceOutput, JobDiscoveryOutput } from "@/types/agent";

const WEIGHTS = {
  skills: 0.5,
  experience: 0.2,
  industry: 0.15,
  location: 0.15,
};

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

function skillOverlap(candidateSkills: string[], requiredSkills: string[]) {
  const candidateSet = new Set(candidateSkills.map(normalize));
  const matched: string[] = [];
  const missing: string[] = [];

  for (const skill of requiredSkills) {
    if (candidateSet.has(normalize(skill))) {
      matched.push(skill);
    } else {
      missing.push(skill);
    }
  }
  return { matched, missing };
}

function experienceScore(candidateYears: number, requiredYearsText: string): number {
  const requiredYears = parseInt(requiredYearsText.match(/\d+/)?.[0] ?? "3", 10);
  if (Number.isNaN(requiredYears)) return 0.7;
  const diff = candidateYears - requiredYears;
  if (diff >= 0 && diff <= 4) return 1;
  if (diff > 4) return 0.75;
  if (diff >= -1) return 0.6;
  return 0.3;
}

function industryScore(candidateIndustry: string, targetIndustry: string): number {
  if (!targetIndustry) return 0.7;
  if (normalize(candidateIndustry) === normalize(targetIndustry)) return 1;
  // Adjacent-industry partial credit for commerce/fintech/software clusters
  const clusters: Record<string, string[]> = {
    "e-commerce": ["marketplace", "retail"],
    fintech: ["payments", "insurtech", "banking"],
    "enterprise software": ["robotics", "healthtech"],
  };
  const target = normalize(targetIndustry);
  const candidate = normalize(candidateIndustry);
  for (const [key, related] of Object.entries(clusters)) {
    if (
      (target === key || related.includes(target)) &&
      (candidate === key || related.includes(candidate))
    ) {
      return 0.55;
    }
  }
  return 0.25;
}

function locationScore(candidateLocation: string, targetLocation: string): number {
  if (!targetLocation) return 0.8;
  const candidate = normalize(candidateLocation);
  const target = normalize(targetLocation);
  if (candidate.includes(target) || target.includes(candidate)) return 1;
  const candidateCountry = candidate.split(",").pop()?.trim() ?? "";
  const targetCountry = target.split(",").pop()?.trim() ?? "";
  if (candidateCountry && candidateCountry === targetCountry) return 0.7;
  if (target.includes("remote")) return 0.9;
  return 0.4;
}

export function scoreCandidate(
  candidate: Candidate,
  job: JobDiscoveryOutput,
  intel: JobIntelligenceOutput
): CandidateMatch {
  const { matched, missing } = skillOverlap(candidate.skills, [
    ...intel.requiredSkills,
    ...intel.preferredSkills,
  ]);
  const requiredMatched = skillOverlap(candidate.skills, intel.requiredSkills).matched;

  const skillsPct = intel.requiredSkills.length
    ? requiredMatched.length / intel.requiredSkills.length
    : matched.length / Math.max(matched.length + missing.length, 1);

  const expScore = experienceScore(candidate.yearsExperience, intel.experience);
  const indScore = industryScore(candidate.industry, intel.industry);
  const locScore = locationScore(candidate.location, job.location);

  const weighted =
    skillsPct * WEIGHTS.skills +
    expScore * WEIGHTS.experience +
    indScore * WEIGHTS.industry +
    locScore * WEIGHTS.location;

  const score = Math.round(Math.min(0.98, Math.max(0.32, weighted)) * 100);

  const explanation = buildExplanation(candidate, requiredMatched, missing, expScore, indScore);

  return {
    candidateId: candidate.id,
    score,
    matchedSkills: matched,
    missingSkills: missing,
    explanation,
  };
}

function buildExplanation(
  candidate: Candidate,
  matched: string[],
  missing: string[],
  expScore: number,
  indScore: number
): string {
  const parts: string[] = [];

  if (matched.length) {
    parts.push(`Covers ${matched.length} of the required skills (${matched.slice(0, 3).join(", ")}${matched.length > 3 ? ", ..." : ""}).`);
  }
  if (expScore >= 1) {
    parts.push(`${candidate.yearsExperience} years of experience lines up well with the seniority bar.`);
  } else if (expScore <= 0.5) {
    parts.push(`${candidate.yearsExperience} years is lighter than the role typically expects.`);
  }
  if (indScore >= 1) {
    parts.push(`Direct ${candidate.industry} background.`);
  } else if (indScore <= 0.3) {
    parts.push(`Comes from outside ${candidate.industry === "" ? "the target" : "a directly adjacent"} industry, worth probing in screen.`);
  }
  if (missing.length) {
    parts.push(`Missing: ${missing.slice(0, 2).join(", ")}.`);
  }

  return parts.join(" ");
}

export function rankCandidates(
  candidates: Candidate[],
  job: JobDiscoveryOutput,
  intel: JobIntelligenceOutput,
  topN = 5
): CandidateMatch[] {
  return candidates
    .map((c) => scoreCandidate(c, job, intel))
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);
}
