import { JobInput } from "@/components/job-input";
import { ResultsPanel } from "@/components/results-panel";
import { WorkflowCard } from "@/components/workflow-card";
import { WORKFLOW_STEPS } from "@/constants/workflow";

export function DemoDashboard() {
  return (
    <div className="grid gap-5 xl:grid-cols-[minmax(0,1.05fr)_minmax(330px,.9fr)_minmax(270px,.75fr)]">
      <JobInput />
      <section className="surface rounded-lg p-5">
        <div className="mb-5 flex items-center justify-between"><h2 className="text-sm font-semibold text-zinc-100">Hermes Workflow</h2><span className="text-xs text-zinc-600">5 agents</span></div>
        <div className="space-y-3">{WORKFLOW_STEPS.map((step) => <WorkflowCard key={step.title} step={step} />)}</div>
      </section>
      <ResultsPanel />
    </div>
  );
}
