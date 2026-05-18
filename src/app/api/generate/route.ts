import { NextResponse } from "next/server";
import { generatePost } from "@/lib/generate";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const notes = String(body.notes ?? "").trim();
    if (!notes) {
      return NextResponse.json({ error: "notes are required" }, { status: 400 });
    }
    const result = await generatePost({
      notes,
      angle: body.angle ? String(body.angle) : undefined,
      fixedLines: body.fixedLines ? String(body.fixedLines) : undefined,
    });
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
