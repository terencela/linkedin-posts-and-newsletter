"use client";

import { useState } from "react";
import { Loader2, Layers } from "lucide-react";

export function BatchPanel({ onDone }: { onDone?: () => void }) {
  const [topics, setTopics] = useState("");
  const [angle, setAngle] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);

  async function handleBatch() {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topics, angle }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Batch failed");
      setResult(`Created ${data.count} drafts in queue.`);
      setTopics("");
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Batch failed");
    } finally {
      setLoading(false);
    }
  }

  const lineCount = topics.split("\n").filter((l) => l.trim()).length;

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <p className="text-sm text-zinc-400">
        One topic per line. Max 30. Each line becomes a draft in your queue.
        This calls the API once per topic — can take a few minutes.
      </p>
      <textarea
        value={topics}
        onChange={(e) => setTopics(e.target.value)}
        rows={14}
        placeholder={"Shadow AI at Swiss enterprises\nWhy procurement kills AI adoption\nWhat I shipped this week at ZRH\n..."}
        className="w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
      />
      <p className="text-xs text-zinc-500">{lineCount} topic{lineCount !== 1 ? "s" : ""}</p>
      <input
        value={angle}
        onChange={(e) => setAngle(e.target.value)}
        placeholder="Shared angle for all (optional)"
        className="h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
      />
      <button
        type="button"
        onClick={handleBatch}
        disabled={loading || lineCount === 0 || lineCount > 30}
        className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-100 text-sm font-medium text-zinc-900 disabled:opacity-40"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers className="h-4 w-4" />}
        {loading ? `Generating ${lineCount} posts...` : `Generate ${lineCount || ""} posts`}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
      {result && <p className="text-sm text-emerald-400">{result}</p>}
    </div>
  );
}
