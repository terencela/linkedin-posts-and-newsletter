"use client";

import { useCallback, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Calendar, ChevronDown, Trash2 } from "lucide-react";
import type { Post, PostStatus } from "@/lib/types";
import { POST_STATUSES, STATUS_LABELS } from "@/lib/types";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";
import { LintBadges } from "./lint-badges";
import { Button } from "@/components/ui/button";
import { LinkedInPreview } from "@/components/ui/linkedin-preview";
import { StatusPipeline } from "@/components/ui/status-pipeline";

const STATUS_RAIL: Record<PostStatus, string> = {
  idea: "border-l-paper-muted/50",
  draft: "border-l-paper-muted",
  ready: "border-l-ready",
  scheduled: "border-l-signal",
  posted: "border-l-paper-muted/30",
};

export function QueuePanel({ refreshKey }: { refreshKey: number }) {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [allRes, filteredRes] = await Promise.all([
      fetch("/api/posts"),
      fetch(filter === "all" ? "/api/posts" : `/api/posts?status=${filter}`),
    ]);
    const allData = await allRes.json();
    const filteredData = await filteredRes.json();
    setAllPosts(allData.posts ?? []);
    setPosts(filteredData.posts ?? []);
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    load();
  }, [load, refreshKey]);

  async function updatePost(id: string, patch: Partial<Post>) {
    const res = await fetch(`/api/posts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(patch),
    });
    if (res.ok) await load();
  }

  async function removePost(id: string) {
    if (!confirm("Delete this post?")) return;
    await fetch(`/api/posts/${id}`, { method: "DELETE" });
    await load();
  }

  return (
    <div className="space-y-6">
      <header>
        <h2 className="text-base font-semibold tracking-tight text-paper">
          Queue
        </h2>
        <p className="mt-1 text-sm text-paper-muted">
          Filter by status. Expand to edit, copy, or schedule.
        </p>
      </header>

      <StatusPipeline
        posts={allPosts}
        activeFilter={filter}
        onFilter={setFilter}
      />

      {loading ? (
        <div className="space-y-3" aria-busy="true">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 animate-pulse border-l-2 border-line bg-surface"
            />
          ))}
        </div>
      ) : null}

      {!loading && posts.length === 0 ? (
        <div className="border border-dashed border-line px-6 py-12 text-center">
          <p className="text-sm text-paper-muted">
            No posts in this stage. Compose one or run a batch.
          </p>
        </div>
      ) : null}

      <ul className="divide-y divide-line border-y border-line">
        {posts.map((post) => {
          const isOpen = expanded === post.id;
          return (
            <li
              key={post.id}
              className={cn(
                "border-l-2 bg-surface/50 transition-colors",
                STATUS_RAIL[post.status],
                isOpen && "bg-surface-raised/80",
              )}
            >
              <div className="flex flex-wrap items-center gap-3 px-4 py-3 sm:flex-nowrap">
                <button
                  type="button"
                  onClick={() => setExpanded(isOpen ? null : post.id)}
                  className="flex min-w-0 flex-1 items-start gap-2 text-left focus-ring rounded-sm"
                  aria-expanded={isOpen}
                >
                  <ChevronDown
                    className={cn(
                      "mt-0.5 h-4 w-4 shrink-0 text-paper-muted transition-transform",
                      isOpen && "rotate-180",
                    )}
                    aria-hidden
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-paper">
                      {post.title}
                    </span>
                    <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-paper-muted">
                      {STATUS_LABELS[post.status]}
                      {post.scheduledAt
                        ? ` · ${format(parseISO(post.scheduledAt), "MMM d HH:mm")}`
                        : ""}
                    </span>
                  </span>
                </button>

                <select
                  value={post.status}
                  onChange={(e) =>
                    updatePost(post.id, {
                      status: e.target.value as PostStatus,
                    })
                  }
                  className="h-11 min-w-[7.5rem] rounded-sm border border-line bg-ink px-2 font-mono text-[11px] uppercase tracking-wide text-paper focus-ring"
                  aria-label={`Status for ${post.title}`}
                >
                  {POST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removePost(post.id)}
                  aria-label={`Delete ${post.title}`}
                  className="text-paper-muted hover:text-danger"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              {isOpen ? (
                <div className="space-y-4 border-t border-line px-4 pb-5 pt-4">
                  <LinkedInPreview
                    body={post.body}
                    onChange={(value) =>
                      setPosts((prev) =>
                        prev.map((p) =>
                          p.id === post.id ? { ...p, body: value } : p,
                        ),
                      )
                    }
                    onBlur={() => updatePost(post.id, { body: post.body })}
                  />
                  <LintBadges warnings={post.lintWarnings} />
                  <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
                    <CopyButton text={post.body} />
                    <label className="flex flex-col gap-1.5">
                      <span className="flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-paper-muted">
                        <Calendar className="h-3.5 w-3.5" aria-hidden />
                        Schedule
                      </span>
                      <input
                        type="datetime-local"
                        className="h-11 rounded-sm border border-line bg-ink px-2 text-sm text-paper focus-ring"
                        value={
                          post.scheduledAt ? post.scheduledAt.slice(0, 16) : ""
                        }
                        onChange={(e) => {
                          const v = e.target.value;
                          updatePost(post.id, {
                            scheduledAt: v
                              ? new Date(v).toISOString()
                              : null,
                            status: v ? "scheduled" : post.status,
                          });
                        }}
                      />
                    </label>
                  </div>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
