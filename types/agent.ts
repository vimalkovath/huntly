export type AgentId =
  | "job-discovery"
  | "job-intelligence"
  | "candidate-matching"
  | "outreach"
  | "hiring-manager";

export type AgentStatus = "idle" | "queued" | "running" | "complete" | "error";

export interface AgentDefinition {
  id: AgentId;
  name: string;
  role: string;
  goal: string;
  soul: string;
}

export interface AgentRunMeta {
  id: AgentId;
  status: AgentStatus;
  confidence: number | null;
  executionTimeMs: number | null;
  reasoningSummary: string | null;
  error?: string;
}

export interface AgentResult<TOutput = unknown> {
  agentId: AgentId;
  output: TOutput;
  confidence: number;
  executionTimeMs: number;
  reasoningSummary: string;
}

// ---- Agent 1: Job Discovery ----
export interface JobDiscoveryOutput {
  title: string;
  company: string;
  location: string;
  normalizedDescription: string;
}

// ---- Agent 2: Job Intelligence ----
export interface JobIntelligenceOutput {
  requiredSkills: string[];
  preferredSkills: string[];
  experience: string;
  industry: string;
  employmentType: string;
  seniority: string;
  risks: string[];
}

// ---- Agent 3: Candidate Matching ----
export interface CandidateMatch {
  candidateId: string;
  score: number;
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export type CandidateMatchingOutput = CandidateMatch[];

// ---- Agent 4: Outreach ----
export interface OutreachOutput {
  recruiterEmail: {
    subject: string;
    body: string;
  };
  candidateEmail: {
    subject: string;
    body: string;
  };
}

// ---- Agent 5: Hiring Manager ----
export interface HiringManagerOutput {
  recommendation: string;
  confidence: number;
  interviewQuestions: string[];
  risks: string[];
  summary: string;
}

export interface HermesRunState {
  jobDiscovery: AgentResult<JobDiscoveryOutput> | null;
  jobIntelligence: AgentResult<JobIntelligenceOutput> | null;
  candidateMatching: AgentResult<CandidateMatchingOutput> | null;
  outreach: AgentResult<OutreachOutput> | null;
  hiringManager: AgentResult<HiringManagerOutput> | null;
}
