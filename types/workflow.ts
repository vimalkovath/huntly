export type WorkflowStatus = "Waiting";

export type WorkflowIcon = "briefcase" | "sparkles" | "search" | "mail" | "users";

export interface WorkflowStep {
  icon: WorkflowIcon;
  title: string;
  status: WorkflowStatus;
  description: string;
}
