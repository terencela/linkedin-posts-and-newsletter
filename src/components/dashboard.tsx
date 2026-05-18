"use client";

import { useState } from "react";
import { ComposePanel } from "./compose-panel";
import { QueuePanel } from "./queue-panel";
import { BatchPanel } from "./batch-panel";
import { cn } from "@/lib/utils";

type Tab = "compose" | "queue" | "batch";

const TABS: { id: Tab; label: string }[] = [
  { id: "compose", label: "Compose" },
  { id: "queue", label: "Queue" },
  { id: "batch", label: "Batch" },
];

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("compose");
  const [refreshKey, setRefreshKey] = useState(0);

  function bumpQueue() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-zinc-800 px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-tight">Postcraft</h1>
            <p className="text-xs text-zinc-500">
              Voice: ~/.ai-os · Copy to{" "}
              <a
                href="https://www.linkedin.com/in/terencela"
                target="_blank"
                rel="noreferrer"
                className="underline hover:text-zinc-300"
              >
                LinkedIn
              </a>
            </p>
          </div>
          <nav className="flex gap-1 rounded-lg border border-zinc-800 p-1">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTab(t.id)}
                className={cn(
                  "h-10 rounded-md px-4 text-sm font-medium transition",
                  tab === t.id
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-400 hover:text-zinc-200",
                )}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {tab === "compose" && <ComposePanel onSaved={() => bumpQueue()} />}
        {tab === "queue" && <QueuePanel refreshKey={refreshKey} />}
        {tab === "batch" && (
          <BatchPanel
            onDone={() => {
              bumpQueue();
              setTab("queue");
            }}
          />
        )}
      </main>
    </div>
  );
}
