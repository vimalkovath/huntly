import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";
import { AGENT_ORDER, AGENT_DEFINITIONS } from "@/lib/hermes/agents/definitions";
import { AGENT_ICONS } from "@/components/hermes/agent-icons";
import { AgentRelayPreview } from "@/components/hermes/agent-relay-preview";
import { buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-7xl px-6">
      <Hero />
      <LogosStrip />
      <HowItWorks />
      <AgentsSection />
      <WaitlistCTA />
    </div>
  );
}

function Hero() {
  return (
    <section className="grid gap-12 py-20 sm:py-28 lg:grid-cols-2 lg:items-center">
      <div>
        <Badge tone="violet" className="mb-6">
          Built on Hermes
        </Badge>
        <h1 className="font-display text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
          Not a job board.
          <br />
          An <span className="text-gradient">AI recruiting agency.</span>
        </h1>
        <p className="mt-6 max-w-lg text-lg text-[var(--color-text-secondary)]">
          Paste a job description. Five specialized Hermes agents take it from there —
          reading the role, sourcing candidates, scoring fit, and drafting outreach —
          exactly like a recruiting team, minus the two-week wait.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <Link href="/demo" className={buttonVariants({ size: "lg" })}>
            Run the Hermes workflow <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/waitlist" className={buttonVariants({ variant: "outline", size: "lg" })}>
            Join the waitlist
          </Link>
        </div>
        <div className="mt-10 flex flex-wrap gap-x-8 gap-y-2 text-sm text-[var(--color-text-muted)]">
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" /> 5 agents, one handoff chain
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Every score is explained
          </span>
          <span className="flex items-center gap-1.5">
            <Check className="h-3.5 w-3.5 text-emerald-400" /> Outreach drafted automatically
          </span>
        </div>
      </div>

      <AgentRelayPreview />
    </section>
  );
}

function LogosStrip() {
  return (
    <section className="border-y border-white/5 py-6">
      <p className="text-center font-mono text-xs uppercase tracking-[0.2em] text-[var(--color-text-muted)]">
        Hermes Buildathon Demo · Payments · E-commerce · Fintech · AI Platform hiring, sourced live
      </p>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      title: "Paste the role",
      body: "Drop in any job description — messy formatting and all. No template required.",
    },
    {
      title: "Watch Hermes work",
      body: "Five agents run in sequence, each handing structured output to the next, live in the UI.",
    },
    {
      title: "Get a ranked shortlist",
      body: "Top 5 candidates, scored and explained — with outreach emails ready to send.",
    },
  ];

  return (
    <section id="how-it-works" className="py-20">
      <div className="mb-12 max-w-xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">How it works</h2>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          Three steps on your side. Five agent handoffs on Hermes&apos; side.
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-3">
        {steps.map((step, i) => (
          <Card key={step.title} className="p-6">
            <span className="font-mono text-xs text-[var(--color-text-muted)]">0{i + 1}</span>
            <h3 className="mt-3 font-display text-lg font-semibold">{step.title}</h3>
            <p className="mt-2 text-sm text-[var(--color-text-secondary)]">{step.body}</p>
          </Card>
        ))}
      </div>
    </section>
  );
}

function AgentsSection() {
  return (
    <section id="agents" className="py-20">
      <div className="mb-12 max-w-xl">
        <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Five agents. One recruiting agency.
        </h2>
        <p className="mt-3 text-[var(--color-text-secondary)]">
          Each agent has a narrow job and a strict output contract — the same way a real
          agency splits sourcing, screening, and coordination across specialists.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {AGENT_ORDER.map((id) => {
          const def = AGENT_DEFINITIONS[id];
          const Icon = AGENT_ICONS[id];
          return (
            <Card key={id} className="glass-hover p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-400/20">
                <Icon className="h-5 w-5 text-white" />
              </div>
              <h3 className="mt-4 font-display text-base font-semibold">{def.name}</h3>
              <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[var(--color-text-muted)]">
                {def.role}
              </p>
              <p className="mt-3 text-sm text-[var(--color-text-secondary)]">{def.goal}</p>
            </Card>
          );
        })}
      </div>
    </section>
  );
}

function WaitlistCTA() {
  return (
    <section className="my-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/10 via-transparent to-cyan-400/10 p-10 text-center sm:p-16">
      <h2 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
        Hiring, or looking? Get early access.
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[var(--color-text-secondary)]">
        We&apos;re opening Huntly to a small group of recruiters and candidates before general
        availability.
      </p>
      <Link href="/waitlist" className={buttonVariants({ size: "lg", className: "mt-8" })}>
        Join the waitlist <ArrowRight className="h-4 w-4" />
      </Link>
    </section>
  );
}
