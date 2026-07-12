import type { WorkflowStep } from "@/types/workflow";

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { icon: "briefcase", title: "Job Discovery Agent", status: "Waiting", description: "Extracts core role requirements" },
  { icon: "sparkles", title: "Job Intelligence Agent", status: "Waiting", description: "Builds a structured hiring brief" },
  { icon: "search", title: "Candidate Matching Agent", status: "Waiting", description: "Identifies the strongest matches" },
  { icon: "mail", title: "Email Generation Agent", status: "Waiting", description: "Prepares personalized outreach" },
  { icon: "users", title: "Recruiter Summary Agent", status: "Waiting", description: "Synthesizes hiring recommendations" },
];
