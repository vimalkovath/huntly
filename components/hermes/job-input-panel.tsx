"use client";

import { Play, Wand2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SAMPLE_JOB_DESCRIPTION } from "@/data/sample-job";

interface JobInputPanelProps {
  value: string;
  onChange: (value: string) => void;
  onRun: () => void;
  running: boolean;
  disabled: boolean;
}

export function JobInputPanel({ value, onChange, onRun, running, disabled }: JobInputPanelProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Job description</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste a job description..."
          rows={16}
          disabled={running}
          className="resize-none font-mono text-xs leading-relaxed"
        />
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button
            onClick={onRun}
            disabled={disabled || running || !value.trim()}
            className="flex-1"
          >
            {running ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Running Hermes...
              </>
            ) : (
              <>
                <Play className="h-4 w-4" /> Run Hermes Workflow
              </>
            )}
          </Button>
          <Button
            variant="outline"
            type="button"
            disabled={running}
            onClick={() => onChange(SAMPLE_JOB_DESCRIPTION)}
          >
            <Wand2 className="h-4 w-4" /> Use sample
          </Button>
        </div>
        <p className="text-xs text-[var(--color-text-muted)]">
          No real ATS is involved — Huntly scores against a mock candidate pool of 20 profiles.
        </p>
      </CardContent>
    </Card>
  );
}
