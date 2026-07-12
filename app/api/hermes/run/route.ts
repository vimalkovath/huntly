import { NextRequest } from "next/server";
import { runHermesPipeline } from "@/lib/hermes/orchestrator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const rawJobDescription: string = typeof body?.jobDescription === "string" ? body.jobDescription : "";

  if (!rawJobDescription.trim()) {
    return new Response(JSON.stringify({ error: "jobDescription is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const event of runHermesPipeline(rawJobDescription)) {
          controller.enqueue(encoder.encode(JSON.stringify(event) + "\n"));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown Hermes pipeline error.";
        controller.enqueue(encoder.encode(JSON.stringify({ type: "agent-error", error: message }) + "\n"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
