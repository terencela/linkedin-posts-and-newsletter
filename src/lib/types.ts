export type PostStatus = "idea" | "draft" | "ready" | "scheduled" | "posted";

export interface Post {
  id: string;
  title: string;
  body: string;
  notes: string;
  status: PostStatus;
  scheduledAt: string | null;
  lintWarnings: string[];
  createdAt: string;
  updatedAt: string;
}

export const POST_STATUSES: PostStatus[] = [
  "idea",
  "draft",
  "ready",
  "scheduled",
  "posted",
];

export const STATUS_LABELS: Record<PostStatus, string> = {
  idea: "Idea",
  draft: "Draft",
  ready: "Ready",
  scheduled: "Scheduled",
  posted: "Posted",
};
