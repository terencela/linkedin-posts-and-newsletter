"use client";

import { useState } from "react";
import { ExternalLink, PenLine, Layers, ListOrdered } from "lucide-react";
import { ComposePanel } from "./compose-panel";
import { QueuePanel } from "./queue-panel";
import { BatchPanel } from "./batch-panel";
import { cn } from "@/lib/utils";

type Tab = "compose" | "queue" | "batch";

const TABS: {
  id: Tab;
  label: string;
  icon: typeof PenLine;
}[] = [
  { id: "compose", label: "Compose", icon: PenLine },
  { id: "queue", label: "Queue", icon: ListOrdered },
  { id: "batch", label: "Batch", icon: Layers },
];

export function Dashboard() {
  const [tab, setTab] = useState<Tab>("compose");
  const [refreshKey, setRefreshKey] = useState(0);

  function bumpQueue() {
    setRefreshKey((k) => k + 1);
  }

  return (
    <div className="relative min-h-[100dvh] bg-ink text-paper">
      <div className="grain" aria-hidden />

      <header className="relative z-10 border-b border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-paper-muted">
              Terence La
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-tight text-paper sm:text-3xl">
              Postcraft
            </h1>
            <p className="mt-1.5 text-sm text-paper-muted">
              Voice from ~/.ai-os ·{" "}
              <a
                href="https://www.linkedin.com/in/terencela"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-paper underline decoration-line underline-offset-4 transition hover:decoration-signal"
              >
                LinkedIn
                <ExternalLink className="h-3 w-3" aria-hidden />
              </a>
            </p>
          </div>

          <nav
            className="hidden gap-0 border border-line sm:flex"
            aria-label="Main sections"
          >
            {TABS.map((t) => (
              <TabButton
                key={t.id}
                active={tab === t.id}
                onClick={() => setTab(t.id)}
                label={t.label}
                icon={t.icon}
              />
            ))}
          </nav>
        </div>

        <nav
          className="fixed bottom-0 left-0 right-0 z-20 grid grid-cols-3 border-t border-line bg-ink/95 backdrop-blur-sm sm:hidden"
          aria-label="Main sections"
        >
          {TABS.map((t) => (
            <TabButton
              key={t.id}
              active={tab === t.id}
              onClick={() => setTab(t.id)}
              label={t.label}
              icon={t.icon}
              mobile
            />
          ))}
        </nav>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-4 py-6 pb-24 sm:px-6 sm:pb-8">
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

function TabButton({
  active,
  onClick,
  label,
  icon: Icon,
  mobile,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  icon: typeof PenLine;
  mobile?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center gap-1 font-mono text-[11px] uppercase tracking-widest transition-colors focus-ring",
        mobile ? "h-14 px-2" : "h-11 min-w-[6.5rem] flex-row gap-2 px-4",
        active
          ? "bg-surface-raised text-paper"
          : "text-paper-muted hover:bg-surface hover:text-paper",
        !mobile && active && "border-b-2 border-b-signal",
      )}
      aria-current={active ? "page" : undefined}
    >
      <Icon className="h-4 w-4 shrink-0" aria-hidden />
      {label}
    </button>
  );
}
