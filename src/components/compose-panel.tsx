"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { CopyButton } from "./copy-button";
import { LintBadges } from "./lint-badges";
import { Button } from "@/components/ui/button";
import { FieldLabel, Input, TextArea } from "@/components/ui/field";
import { LinkedInPreview } from "@/components/ui/linkedin-preview";

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
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      <section className="space-y-5">
        <header>
          <h2 className="text-base font-semibold tracking-tight text-paper">
            Input
          </h2>
          <p className="mt-1 text-sm text-paper-muted">
            Rough notes in. Voice rules from ~/.ai-os apply on generate.
          </p>
        </header>

        <div>
          <FieldLabel htmlFor="notes" hint="Bullets, voice memos, half-formed takes">
            Rough notes
          </FieldLabel>
          <TextArea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={9}
            placeholder="Paste voice notes, bullets, half-formed thoughts..."
          />
        </div>

        <div>
          <FieldLabel htmlFor="angle">Angle (optional)</FieldLabel>
          <Input
            id="angle"
            value={angle}
            onChange={(e) => setAngle(e.target.value)}
            placeholder="The take you want to land"
          />
        </div>

        <div>
          <FieldLabel htmlFor="fixed">Fixed lines (optional)</FieldLabel>
          <TextArea
            id="fixed"
            value={fixedLines}
            onChange={(e) => setFixedLines(e.target.value)}
            rows={3}
            placeholder="Lines that must appear verbatim"
          />
        </div>

        <Button
          onClick={handleGenerate}
          disabled={!notes.trim()}
          loading={loading}
          className="w-full"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          {loading ? "Generating..." : "Generate post"}
        </Button>

        {error ? (
          <p className="text-sm text-danger" role="alert">
            {error}
          </p>
        ) : null}
      </section>

      <section className="space-y-4">
        <header>
          <h2 className="text-base font-semibold tracking-tight text-paper">
            Output
          </h2>
          <p className="mt-1 text-sm text-paper-muted">
            Edit, lint, copy, or queue.
          </p>
        </header>

        <LinkedInPreview
          body={body}
          onChange={(value) => {
            setBody(value);
            setLintWarnings([]);
          }}
        />

        <LintBadges warnings={lintWarnings} />

        <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
          <CopyButton text={body} fullWidth />
          <Button
            variant="secondary"
            onClick={() => handleSave("draft")}
            disabled={saving || !body.trim()}
            loading={saving}
            className="w-full sm:w-auto"
          >
            Save draft
          </Button>
          <Button
            variant="ready"
            onClick={() => handleSave("ready")}
            disabled={saving || !body.trim()}
            className="w-full sm:w-auto"
          >
            Mark ready
          </Button>
        </div>
      </section>
    </div>
  );
}
