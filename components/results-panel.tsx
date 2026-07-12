import { Sparkles } from "lucide-react";

export function ResultsPanel() {
  return (
    <section className="surface flex min-h-[420px] flex-col rounded-lg p-5">
      <h2 className="text-sm font-semibold text-zinc-100">Results</h2>
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <span className="flex size-12 items-center justify-center rounded-lg border border-white/[0.09] bg-white/[0.04] text-emerald-200"><Sparkles size={21} /></span>
        <p className="mt-4 max-w-56 text-sm leading-6 text-zinc-500">Run the Hermes workflow to see AI-generated candidate recommendations.</p>
      </div>
    </section>
  );
}
