import { NextResponse } from "next/server";
import { generatePost } from "@/lib/generate";
import { createPost } from "@/lib/posts-store";
import { titleFromBody } from "@/lib/lint";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const raw = String(body.topics ?? "").trim();
    if (!raw) {
      return NextResponse.json({ error: "topics are required" }, { status: 400 });
    }

    const lines = raw
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean);

    if (lines.length > 30) {
      return NextResponse.json(
        { error: "Max 30 topics per batch" },
        { status: 400 },
      );
    }

    const posts = [];
    for (const topic of lines) {
      const { body: postBody, lintWarnings } = await generatePost({
        notes: topic,
        angle: body.angle ? String(body.angle) : undefined,
      });
      const post = await createPost({
        title: titleFromBody(postBody),
        body: postBody,
        notes: topic,
        status: "draft",
        lintWarnings,
      });
      posts.push(post);
    }

    return NextResponse.json({ posts, count: posts.length });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Batch failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
