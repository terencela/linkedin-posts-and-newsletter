import { NextResponse } from "next/server";
import { listPosts, createPost } from "@/lib/posts-store";
import { lintPost, titleFromBody } from "@/lib/lint";
import type { PostStatus } from "@/lib/types";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") as PostStatus | null;
  const posts = await listPosts(status ?? undefined);
  return NextResponse.json({ posts });
}

export async function POST(request: Request) {
  const body = await request.json();
  const text = String(body.body ?? "").trim();
  if (!text) {
    return NextResponse.json({ error: "body is required" }, { status: 400 });
  }
  const lintWarnings = lintPost(text);
  const post = await createPost({
    title: String(body.title ?? titleFromBody(text)),
    body: text,
    notes: String(body.notes ?? ""),
    status: (body.status as PostStatus) ?? "draft",
    scheduledAt: body.scheduledAt ?? null,
    lintWarnings,
  });
  return NextResponse.json({ post });
}
