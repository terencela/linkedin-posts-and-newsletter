"use client";

import { useCallback, useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { Trash2 } from "lucide-react";
import type { Post, PostStatus } from "@/lib/types";
import { POST_STATUSES, STATUS_LABELS } from "@/lib/types";
import { CopyButton } from "./copy-button";
import { LintBadges } from "./lint-badges";
import { cn } from "@/lib/utils";

export function QueuePanel({ refreshKey }: { refreshKey: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filter, setFilter] = useState<PostStatus | "all">("all");
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const q = filter === "all" ? "" : `?status=${filter}`;
    const res = await fetch(`/api/posts${q}`);
    const data = await res.json();
    setPosts(data.posts ?? []);
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
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")} label="All" />
        {POST_STATUSES.map((s) => (
          <FilterChip
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
            label={STATUS_LABELS[s]}
          />
        ))}
      </div>

      {loading && <p className="text-sm text-zinc-500">Loading...</p>}
      {!loading && posts.length === 0 && (
        <p className="text-sm text-zinc-500">No posts yet. Compose one first.</p>
      )}

      <ul className="space-y-3">
        {posts.map((post) => (
          <li
            key={post.id}
            className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <button
                type="button"
                onClick={() => setExpanded(expanded === post.id ? null : post.id)}
                className="text-left text-sm font-medium text-zinc-100 hover:text-white"
              >
                {post.title}
              </button>
              <div className="flex items-center gap-2">
                <select
                  value={post.status}
                  onChange={(e) =>
                    updatePost(post.id, { status: e.target.value as PostStatus })
                  }
                  className="h-9 rounded border border-zinc-700 bg-zinc-950 px-2 text-xs text-zinc-300"
                >
                  {POST_STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => removePost(post.id)}
                  className="rounded p-2 text-zinc-500 hover:bg-zinc-800 hover:text-red-400"
                  aria-label="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {post.scheduledAt && (
              <p className="mt-1 text-xs text-zinc-500">
                Scheduled: {format(parseISO(post.scheduledAt), "MMM d, yyyy HH:mm")}
              </p>
            )}

            {expanded === post.id && (
              <div className="mt-4 space-y-3 border-t border-zinc-800 pt-4">
                <textarea
                  value={post.body}
                  onChange={(e) =>
                    setPosts((prev) =>
                      prev.map((p) =>
                        p.id === post.id ? { ...p, body: e.target.value } : p,
                      ),
                    )
                  }
                  onBlur={() => updatePost(post.id, { body: post.body })}
                  rows={12}
                  className="w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm leading-relaxed text-zinc-100"
                />
                <LintBadges warnings={post.lintWarnings} />
                <div className="flex flex-wrap items-end gap-3">
                  <CopyButton text={post.body} />
                  <label className="text-xs text-zinc-500">
                    Schedule
                    <input
                      type="datetime-local"
                      className="mt-1 block h-10 rounded border border-zinc-700 bg-zinc-950 px-2 text-sm text-zinc-200"
                      value={
                        post.scheduledAt
                          ? post.scheduledAt.slice(0, 16)
                          : ""
                      }
                      onChange={(e) => {
                        const v = e.target.value;
                        updatePost(post.id, {
                          scheduledAt: v ? new Date(v).toISOString() : null,
                          status: v ? "scheduled" : post.status,
                        });
                      }}
                    />
                  </label>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "h-9 rounded-full px-3 text-xs font-medium transition",
        active
          ? "bg-zinc-100 text-zinc-900"
          : "border border-zinc-800 text-zinc-400 hover:border-zinc-600",
      )}
    >
      {label}
    </button>
  );
}
