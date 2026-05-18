import { promises as fs } from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import type { Post, PostStatus } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const POSTS_FILE = path.join(DATA_DIR, "posts.json");

async function ensureStore(): Promise<Post[]> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const raw = await fs.readFile(POSTS_FILE, "utf-8");
    return JSON.parse(raw) as Post[];
  } catch {
    const empty: Post[] = [];
    await fs.writeFile(POSTS_FILE, JSON.stringify(empty, null, 2));
    return empty;
  }
}

async function writeAll(posts: Post[]): Promise<void> {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(POSTS_FILE, JSON.stringify(posts, null, 2));
}

export async function listPosts(status?: PostStatus): Promise<Post[]> {
  const posts = await ensureStore();
  const sorted = [...posts].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );
  if (!status) return sorted;
  return sorted.filter((p) => p.status === status);
}

export async function getPost(id: string): Promise<Post | null> {
  const posts = await ensureStore();
  return posts.find((p) => p.id === id) ?? null;
}

export async function createPost(
  input: Pick<Post, "title" | "body" | "notes" | "status" | "lintWarnings"> &
    Partial<Pick<Post, "scheduledAt">>,
): Promise<Post> {
  const now = new Date().toISOString();
  const post: Post = {
    id: uuidv4(),
    title: input.title,
    body: input.body,
    notes: input.notes,
    status: input.status,
    scheduledAt: input.scheduledAt ?? null,
    lintWarnings: input.lintWarnings,
    createdAt: now,
    updatedAt: now,
  };
  const posts = await ensureStore();
  posts.push(post);
  await writeAll(posts);
  return post;
}

export async function updatePost(
  id: string,
  patch: Partial<
    Pick<Post, "title" | "body" | "notes" | "status" | "scheduledAt" | "lintWarnings">
  >,
): Promise<Post | null> {
  const posts = await ensureStore();
  const index = posts.findIndex((p) => p.id === id);
  if (index === -1) return null;
  const updated: Post = {
    ...posts[index],
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  posts[index] = updated;
  await writeAll(posts);
  return updated;
}

export async function deletePost(id: string): Promise<boolean> {
  const posts = await ensureStore();
  const next = posts.filter((p) => p.id !== id);
  if (next.length === posts.length) return false;
  await writeAll(next);
  return true;
}
