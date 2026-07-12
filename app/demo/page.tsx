import type { Metadata } from "next";
import { HermesDemo } from "@/components/hermes/hermes-demo";

export const metadata: Metadata = {
  title: "Run the Hermes workflow — Huntly",
};

export default function DemoPage() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 py-10">
      <div className="mb-8">
        <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-text-muted)]">
          Live demo
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Watch five agents run a search, live.
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-text-secondary)]">
          Paste a job description on the left, or use the sample, then run the Hermes workflow.
          Each agent card expands once it completes — check its reasoning or the raw JSON it
          handed to the next agent.
        </p>
      </div>

      <HermesDemo />
    </div>
  );
}
