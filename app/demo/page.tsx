import { DemoDashboard } from "@/features/demo/demo-dashboard";
import { Navbar } from "@/components/navbar";
import { PageContainer } from "@/components/page-container";

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-hero-glow">
      <Navbar />
      <main className="py-10 sm:py-14">
        <PageContainer>
          <div className="mb-9"><p className="text-xs font-medium uppercase tracking-[0.16em] text-emerald-300/80">Workspace</p><h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">Your AI recruiting team</h1><p className="mt-2 text-sm text-zinc-500">Give Huntly a role brief to begin the recruiting workflow.</p></div>
          <DemoDashboard />
        </PageContainer>
      </main>
    </div>
  );
}
