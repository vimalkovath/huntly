import { BriefcaseBusiness, Mail, SearchCheck, Sparkles, UsersRound } from "lucide-react";
import type { WorkflowStep } from "@/types/workflow";

export const WORKFLOW_STEPS: WorkflowStep[] = [
  { icon: BriefcaseBusiness, title: "Job Discovery Agent", status: "Waiting", description: "Extracts core role requirements" },
  { icon: Sparkles, title: "Job Intelligence Agent", status: "Waiting", description: "Builds a structured hiring brief" },
  { icon: SearchCheck, title: "Candidate Matching Agent", status: "Waiting", description: "Identifies the strongest matches" },
  { icon: Mail, title: "Email Generation Agent", status: "Waiting", description: "Prepares personalized outreach" },
  { icon: UsersRound, title: "Recruiter Summary Agent", status: "Waiting", description: "Synthesizes hiring recommendations" },
];
