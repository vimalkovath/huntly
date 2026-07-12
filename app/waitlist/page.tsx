"use client";

import { useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Role = "recruiter" | "candidate";
type Status = "idle" | "submitting" | "success" | "error";

export default function WaitlistPage() {
  const [role, setRole] = useState<Role>("recruiter");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, role, name: name || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
        return;
      }

      setStatus("success");
      setMessage("You're on the list. We'll be in touch soon.");
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 py-16">
      <Card className="w-full p-2">
        <CardHeader>
          <CardTitle className="font-display text-2xl">Join the Huntly waitlist</CardTitle>
        </CardHeader>
        <CardContent>
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-400/10">
                <Check className="h-6 w-6 text-emerald-400" />
              </div>
              <p className="text-sm text-[var(--color-text-secondary)]">{message}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex gap-2 rounded-xl bg-black/30 p-1">
                {(["recruiter", "candidate"] as Role[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={cn(
                      "flex-1 rounded-lg py-2 text-sm font-medium capitalize transition",
                      role === r ? "bg-gradient-to-r from-violet-500 to-cyan-400 text-black" : "text-[var(--color-text-secondary)]"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[var(--color-text-muted)]">Name (optional)</label>
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ada Lovelace" />
              </div>

              <div>
                <label className="mb-1.5 block text-xs text-[var(--color-text-muted)]">Email</label>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                />
              </div>

              {status === "error" && message && (
                <p className="text-xs text-rose-400">{message}</p>
              )}

              <Button type="submit" className="w-full" disabled={status === "submitting"}>
                {status === "submitting" ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" /> Joining...
                  </>
                ) : (
                  `Join as ${role}`
                )}
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
