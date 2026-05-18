"use client";

import { useState } from "react";
import { Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, TextArea } from "@/components/ui/field";

export function BatchPanel({ onDone }: { onDone?: () => void }) {
  const [topics, setTopics] = useState("");
  const [angle, setAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const lines = topics.split("\n").filter((l) => l.trim());
  const lineCount = lines.length;
  const maxTopics = 30;

  async function handleBatch() {
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);

    try {
      const res = await fetch("/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics, angle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Batch failed");
      setProgress(100);
      setResult(`Created ${data.count} drafts in queue.`);
      setTopics("");
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Batch failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <header>
        <h2 className="text-base font-semibold tracking-tight text-paper">
          Batch generate
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-paper-muted">
          One topic per line. Max {maxTopics}. Each line becomes a draft. One
          API call per topic, so expect a few minutes for large batches.
        </p>
      </header>

      <div className="flex items-baseline justify-between gap-4 border-b border-line pb-3">
        <span className="font-mono text-[11px] uppercase tracking-widest text-paper-muted">
          Topics
        </span>
        <span
          className={cnCount(
            lineCount,
            maxTopics,
          )}
        >
          {lineCount}
          <span className="text-paper-muted"> / {maxTopics}</span>
        </span>
      </div>

      <TextArea
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
        rows={14}
        placeholder={
          "Shadow AI at Swiss enterprises\nWhy procurement kills AI adoption\nWhat I shipped this week at ZRH"
        }
        aria-describedby="batch-topic-hint"
      />
      <p id="batch-topic-hint" className="sr-only">
        Enter one topic per line, up to {maxTopics} topics
      </p>

      <div>
        <FieldLabel htmlFor="batch-angle">Shared angle (optional)</FieldLabel>
        <Input
          id="batch-angle"
          value={angle}
          onChange={(e) => setAngle(e.target.value)}
          placeholder="Same take across all topics"
        />
      </div>

      {loading ? (
        <div className="space-y-2" aria-live="polite">
          <div className="h-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full bg-signal transition-all duration-500"
              style={{ width: `${progress || 12}%` }}
            />
          </div>
          <p className="font-mono text-[11px] uppercase tracking-widest text-paper-muted">
            Generating {lineCount} post{lineCount !== 1 ? "s" : ""}...
          </p>
        </div>
      ) : null}

      <Button
        onClick={handleBatch}
        disabled={loading || lineCount === 0 || lineCount > maxTopics}
        loading={loading}
        className="w-full"
      >
        <Layers className="h-4 w-4" aria-hidden />
        {loading
          ? `Generating ${lineCount} posts...`
          : `Generate ${lineCount || 0} posts`}
      </Button>

      {error ? (
        <p className="text-sm text-danger" role="alert">
          {error}
        </p>
      ) : null}
      {result ? (
        <p className="border-l-2 border-ready bg-ready-dim py-2 pl-3 text-sm text-ready">
          {result}
        </p>
      ) : null}
    </div>
  );
}

function cnCount(count: number, max: number) {
  const over = count > max;
  return `font-mono text-2xl tabular-nums tracking-tight ${over ? "text-danger" : "text-paper"}`;
}
