import { NextResponse } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/posts-store";
import { lintPost, titleFromBody } from "@/lib/lint";
import type { PostStatus } from "@/lib/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(request: Request, { params }: Params) {
  const { id } = await params;
  const body = await request.json();
  const patch: Record<string, unknown> = {};

  if (body.title !== undefined) patch.title = String(body.title);
  if (body.notes !== undefined) patch.notes = String(body.notes);
  if (body.status !== undefined) patch.status = body.status as PostStatus;
  if (body.scheduledAt !== undefined) {
    patch.scheduledAt = body.scheduledAt === "" ? null : String(body.scheduledAt);
  }
  if (body.body !== undefined) {
    const text = String(body.body).trim();
    patch.body = text;
    patch.lintWarnings = lintPost(text);
    if (!body.title) patch.title = titleFromBody(text);
  }

  const post = await updatePost(id, patch);
  if (!post) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function DELETE(_request: Request, { params }: Params) {
  const { id } = await params;
  const ok = await deletePost(id);
  if (!ok) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
