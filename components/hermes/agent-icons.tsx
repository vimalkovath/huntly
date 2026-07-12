import { FileSearch, BrainCircuit, Users, Mail, Gavel, type LucideIcon } from "lucide-react";
import type { AgentId } from "@/types/agent";

export const AGENT_ICONS: Record<AgentId, LucideIcon> = {
  "job-discovery": FileSearch,
  "job-intelligence": BrainCircuit,
  "candidate-matching": Users,
  outreach: Mail,
  "hiring-manager": Gavel,
};
