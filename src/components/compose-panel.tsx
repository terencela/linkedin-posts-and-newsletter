"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { CopyButton } from "./copy-button";
import { LintBadges } from "./lint-badges";
import { cn } from "@/lib/utils";

export function ComposePanel({ onSaved }: { onSaved?: () => void }) {
  const [notes, setNotes] = useState("");
  const [angle, setAngle] = useState("");
  const [fixedLines, setFixedLines] = useState("");
  const [body, setBody] = useState("");
  const [lintWarnings, setLintWarnings] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes, angle, fixedLines }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Generate failed");
      setBody(data.body);
      setLintWarnings(data.lintWarnings ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Generate failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(status: "draft" | "ready") {
    if (!body.trim()) return;
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body, notes, status, lintWarnings }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Save failed");
      }
      setNotes("");
      setAngle("");
      setFixedLines("");
      setBody("");
      setLintWarnings([]);
      onSaved?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="space-y-4">
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Rough notes
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={10}
            placeholder="Paste voice notes, bullets, half-formed thoughts..."
            className="w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Angle (optional)
          </label>
          <input
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            placeholder="The take you want to land"
            className="h-11 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-zinc-500">
            Fixed lines (optional)
          </label>
          <textarea
            value={fixedLines}
            onChange={(e) => setFixedLines(e.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
          />
        </div>
        <button
          type="button"
          onClick={handleGenerate}
          disabled={loading || !notes.trim()}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-zinc-100 text-sm font-medium text-zinc-900 disabled:opacity-40"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
          {loading ? "Generating..." : "Generate post"}
        </button>
        {error && <p className="text-sm text-red-400">{error}</p>}
      </section>

      <section className="space-y-4">
        <label className="block text-xs font-medium uppercase tracking-wide text-zinc-500">
          Output
        </label>
        <textarea
          value={body}
          onChange={(e) => {
            setBody(e.target.value);
            setLintWarnings([]);
          }}
          rows={16}
          placeholder="Generated post appears here. Edit freely."
          className="w-full resize-y rounded-md border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none"
        />
        <LintBadges warnings={lintWarnings} />
        <div className="flex flex-wrap gap-2">
          <CopyButton text={body} className={cn(!body.trim() && "pointer-events-none opacity-40")} />
          <button
            type="button"
            onClick={() => handleSave("draft")}
            disabled={saving || !body.trim()}
            className="h-11 rounded-md border border-zinc-700 px-4 text-sm text-zinc-300 disabled:opacity-40"
          >
            Save draft
          </button>
          <button
            type="button"
            onClick={() => handleSave("ready")}
            disabled={saving || !body.trim()}
            className="h-11 rounded-md border border-emerald-800/50 bg-emerald-950/40 px-4 text-sm text-emerald-300 disabled:opacity-40"
          >
            Mark ready
          </button>
        </div>
      </section>
    </div>
  );
}
