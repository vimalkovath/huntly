"use client";

import { motion } from "framer-motion";
import { Check, X, Mail, Gavel, Sparkles } from "lucide-react";
import type { HermesRunState } from "@/types/agent";
import { candidates } from "@/data/candidates";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export function ResultsPanel({ state }: { state: HermesRunState }) {
  const hasJob = Boolean(state.jobDiscovery);

  if (!hasJob) {
    return (
      <Card className="flex h-full min-h-[420px] flex-col items-center justify-center p-10 text-center">
        <Sparkles className="h-6 w-6 text-[var(--color-text-muted)]" />
        <p className="mt-3 text-sm text-[var(--color-text-secondary)]">
          Results will appear here as each Hermes agent finishes its work.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-5">
      {state.jobDiscovery && <JobSummaryCard result={state.jobDiscovery.output} />}
      {state.candidateMatching && <CandidatesCard matches={state.candidateMatching.output} />}
      {state.outreach && <OutreachCard outreach={state.outreach.output} />}
      {state.hiringManager && <HiringManagerCard result={state.hiringManager.output} />}
    </div>
  );
}

function JobSummaryCard({ result }: { result: NonNullable<HermesRunState["jobDiscovery"]>["output"] }) {
  return (
    <Card className="p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
        Job summary
      </p>
      <h3 className="mt-1 font-display text-lg font-semibold text-white">{result.title}</h3>
      <p className="text-sm text-[var(--color-text-secondary)]">
        {result.company} · {result.location}
      </p>
    </Card>
  );
}

function CandidatesCard({
  matches,
}: {
  matches: NonNullable<HermesRunState["candidateMatching"]>["output"];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Top candidates</CardTitle>
        <Badge tone="violet">{matches.length} shortlisted</Badge>
      </CardHeader>
      <CardContent className="space-y-3">
        {matches.map((match, i) => {
          const candidate = candidates.find((c) => c.id === match.candidateId);
          if (!candidate) return null;
          return (
            <motion.div
              key={match.candidateId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="rounded-xl border border-white/8 bg-black/20 p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-sm font-semibold text-white">{candidate.name}</p>
                  <p className="text-xs text-[var(--color-text-muted)]">
                    {candidate.title} · {candidate.company}
                  </p>
                </div>
                <ScoreDial score={match.score} />
              </div>

              <p className="mt-3 text-xs leading-relaxed text-[var(--color-text-secondary)]">
                {match.explanation}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {match.matchedSkills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-2 py-0.5 text-[10px] text-emerald-300"
                  >
                    <Check className="h-2.5 w-2.5" /> {skill}
                  </span>
                ))}
                {match.missingSkills.map((skill) => (
                  <span
                    key={skill}
                    className="flex items-center gap-1 rounded-full border border-rose-400/25 bg-rose-400/10 px-2 py-0.5 text-[10px] text-rose-300"
                  >
                    <X className="h-2.5 w-2.5" /> {skill}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}

function ScoreDial({ score }: { score: number }) {
  const tone = score >= 85 ? "text-emerald-300" : score >= 70 ? "text-amber-300" : "text-rose-300";
  return (
    <div className="text-right">
      <div className={`font-mono text-lg font-semibold ${tone}`}>{score}%</div>
      <div className="text-[9px] uppercase tracking-wide text-[var(--color-text-muted)]">fit</div>
    </div>
  );
}

function OutreachCard({ outreach }: { outreach: NonNullable<HermesRunState["outreach"]>["output"] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-4 w-4 text-cyan-300" /> Outreach drafts
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <EmailBlock label="To recruiting team" subject={outreach.recruiterEmail.subject} body={outreach.recruiterEmail.body} />
        <EmailBlock label="To candidate" subject={outreach.candidateEmail.subject} body={outreach.candidateEmail.body} />
      </CardContent>
    </Card>
  );
}

function EmailBlock({ label, subject, body }: { label: string; subject: string; body: string }) {
  return (
    <div className="rounded-xl border border-white/8 bg-black/20 p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">{label}</p>
      <p className="mt-1 text-sm font-medium text-white">{subject}</p>
      <p className="scroll-thin mt-2 max-h-40 overflow-auto whitespace-pre-line text-xs leading-relaxed text-[var(--color-text-secondary)]">
        {body}
      </p>
    </div>
  );
}

function HiringManagerCard({ result }: { result: NonNullable<HermesRunState["hiringManager"]>["output"] }) {
  return (
    <Card className="border-violet-400/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Gavel className="h-4 w-4 text-violet-300" /> Hiring manager verdict
        </CardTitle>
        <Badge tone="violet">{Math.round(result.confidence * 100)}% confident</Badge>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-white">{result.recommendation}</p>
        <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">{result.summary}</p>

        <div>
          <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
            Suggested interview focus
          </p>
          <ul className="space-y-1.5 text-xs text-[var(--color-text-secondary)]">
            {result.interviewQuestions.map((q) => (
              <li key={q} className="flex gap-2">
                <span className="text-violet-300">→</span>
                {q}
              </li>
            ))}
          </ul>
        </div>

        {result.risks.length > 0 && (
          <div>
            <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Risks</p>
            <ul className="space-y-1.5 text-xs text-amber-300/90">
              {result.risks.map((r) => (
                <li key={r} className="flex gap-2">
                  <span>⚠</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
