# Huntly — The AI Recruiting Agency

Built for the **Hermes Buildathon**. Huntly replaces the traditional recruiting workflow
(post a job → search LinkedIn → review hundreds of resumes → manually write outreach → wait)
with five specialized Hermes agents that source, score, and reach out to candidates end to end,
live, in front of the user.

## What it demonstrates

- **Multi-agent orchestration.** Hermes runs five independent agents in sequence — Job
  Discovery, Job Intelligence, Candidate Matching, Outreach, and Hiring Manager — each with
  its own role, SOUL (system prompt), and strict JSON output contract.
- **Real handoffs.** Every agent's structured output becomes the next agent's input. There is
  no single mega-prompt doing all the work.
- **Explainable scoring.** Candidate Matching uses transparent, weighted scoring (skills,
  experience, industry, location) over a mock dataset — no embeddings, no vector DB, no black
  box. Every match ships with matched/missing skills and a plain-English explanation.
- **A visible pipeline.** The `/demo` page streams live progress from the orchestrator via
  NDJSON, so the UI shows "Running..." → "Complete" for each agent in real time, with
  expandable reasoning and raw JSON per agent.

## Tech stack

| Layer      | Choice                                                      |
| ---------- | ------------------------------------------------------------ |
| Frontend   | Next.js (App Router), TypeScript, Tailwind CSS v4, Framer Motion, Lucide React |
| Backend    | Next.js Route Handlers (Node runtime), streamed NDJSON       |
| Database   | Supabase (waitlist only — with an in-memory fallback so the demo works with zero config) |
| Deployment | Vercel                                                        |
| LLM        | Abstracted `AI_PROVIDER_*` interface (GPT-5.5 / any OpenAI-compatible endpoint). Runs fully offline on deterministic mock generators when no key is set. |

> The brief specified Next.js 15; `create-next-app` installed the latest available Next.js
> (16.x) with the same App Router APIs used throughout this project.

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — see below
npm run dev
```

Open `http://localhost:3000`. The `/demo` page works immediately with **zero configuration** —
no API keys required. Every agent falls back to realistic, deterministic mock reasoning when
`AI_PROVIDER_API_KEY` isn't set, and the waitlist falls back to an in-memory store when
Supabase isn't configured.

### Optional: connect a real LLM

Set these in `.env.local` to route agent reasoning through a real OpenAI-compatible chat
completions endpoint instead of the mock generators:

```
AI_PROVIDER_API_KEY=sk-...
AI_PROVIDER_BASE_URL=https://api.openai.com/v1
AI_PROVIDER_MODEL=gpt-5.5
```

### Optional: connect Supabase for the waitlist

1. Create a Supabase project.
2. Run `supabase/schema.sql` in the SQL editor to create the `waitlist` table.
3. Set `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in `.env.local`.

## Project structure

```
app/
  page.tsx                 Landing page
  demo/page.tsx             Live Hermes workflow demo
  waitlist/page.tsx         Waitlist form
  api/hermes/run/route.ts   Streams the Hermes pipeline as NDJSON
  api/waitlist/route.ts     Waitlist signup (Supabase or in-memory)
components/
  hermes/                   Agent cards, execution timeline, results panel
  ui/                       Small design-system primitives (button, card, badge, input)
lib/
  hermes/
    agents/                 One file per agent + shared definitions/timing
    orchestrator.ts          Runs all five agents, yields progress events
  services/
    ai-provider.ts           LLM abstraction with mock fallback
    scoring.ts                Weighted candidate scoring engine
  supabase/server.ts         Server-only Supabase client
data/
  candidates.ts              20 mock candidate profiles
  sample-job.ts               Sample job description for the demo
types/
  agent.ts, candidate.ts       Shared TypeScript types
supabase/schema.sql           Waitlist table definition
```

## The five agents

| # | Agent                  | Role                 | Input                        | Output                                                        |
|---|-------------------------|-----------------------|-------------------------------|-----------------------------------------------------------------|
| 1 | Job Discovery Agent      | Technical Recruiter   | Raw pasted job description    | `{ title, company, location, normalizedDescription }`           |
| 2 | Job Intelligence Agent   | Hiring Analyst        | Normalized job                | `{ requiredSkills, preferredSkills, experience, industry, employmentType, seniority, risks }` |
| 3 | Candidate Matching Agent | Talent Sourcer        | Job + requirements            | Top 5 `{ candidate, score, matchedSkills, missingSkills, explanation }` |
| 4 | Outreach Agent           | Recruiting Coordinator| Job + requirements + top match| `{ recruiterEmail, candidateEmail }`                             |
| 5 | Hiring Manager Agent     | Hiring Manager        | Every previous agent's output | `{ recommendation, confidence, interviewQuestions, risks, summary }` |

## What's intentionally out of scope

Per the buildathon brief, this MVP does not include authentication, payments, an admin
dashboard, real ATS integrations, real LinkedIn scraping, resume parsing, or production
infrastructure. Candidate data is a realistic mock dataset of 20 profiles in
`data/candidates.ts`.
