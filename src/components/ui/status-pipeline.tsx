"use client";

import type { Post, PostStatus } from "@/lib/types";
import { POST_STATUSES, STATUS_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";

const STATUS_ACCENT: Record<PostStatus, string> = {
  idea: "bg-paper-muted",
  draft: "bg-paper-muted/70",
  ready: "bg-ready",
  scheduled: "bg-signal",
  posted: "bg-paper-muted/40",
};

export function StatusPipeline({
  posts,
  activeFilter,
  onFilter,
}: {
  posts: Post[];
  activeFilter: PostStatus | "all";
  onFilter: (status: PostStatus | "all") => void;
}) {
  const counts = POST_STATUSES.reduce(
    (acc, status) => {
      acc[status] = posts.filter((p) => p.status === status).length;
      return acc;
    },
    {} as Record<PostStatus, number>,
  );
  const total = posts.length;

  return (
    <div
      className="overflow-x-auto border-b border-line pb-4"
      role="tablist"
      aria-label="Queue status pipeline"
    >
      <div className="flex min-w-max items-stretch gap-0">
        <PipelineNode
          label="All"
          count={total}
          active={activeFilter === "all"}
          dotClass="bg-paper"
          onClick={() => onFilter("all")}
        />
        {POST_STATUSES.map((status, index) => (
          <div key={status} className="flex items-center">
            <Connector />
            <PipelineNode
              label={STATUS_LABELS[status]}
              count={counts[status]}
              active={activeFilter === status}
              dotClass={STATUS_ACCENT[status]}
              onClick={() => onFilter(status)}
            />
            {index === POST_STATUSES.length - 1 ? null : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function Connector() {
  return (
    <div
      className="mx-1 hidden h-px w-6 shrink-0 bg-line sm:block"
      aria-hidden
    />
  );
}

function PipelineNode({
  label,
  count,
  active,
  dotClass,
  onClick,
}: {
  label: string;
  count: number;
  active: boolean;
  dotClass: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={cn(
        "flex min-w-[4.5rem] flex-col items-center gap-1 rounded-sm px-3 py-2 transition-colors focus-ring",
        active
          ? "bg-surface-raised text-paper"
          : "text-paper-muted hover:bg-surface hover:text-paper",
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", dotClass)}
        aria-hidden
      />
      <span className="font-mono text-[10px] uppercase tracking-widest">
        {label}
      </span>
      <span className="font-mono text-sm tabular-nums leading-none">
        {count}
      </span>
    </button>
  );
}
