import { createOpenAI } from "@ai-sdk/openai";
import { generateText } from "ai";
import { lintPost } from "./lint";
import { loadVoicePack, buildSystemPrompt } from "./voice";

export interface GenerateInput {
  notes: string;
  angle?: string;
  fixedLines?: string;
}

export interface GenerateResult {
  body: string;
  lintWarnings: string[];
}

export async function generatePost(input: GenerateInput): Promise<GenerateResult> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set. Add it to .env.local");
  }

  const { voice, guardrails } = await loadVoicePack();
  const openai = createOpenAI({ apiKey });
  const model = process.env.OPENAI_MODEL ?? "gpt-4o";

  const userParts = [
    `Rough notes:\n${input.notes.trim()}`,
    input.angle ? `Angle / take:\n${input.angle.trim()}` : null,
    input.fixedLines
      ? `Fixed lines (keep verbatim):\n${input.fixedLines.trim()}`
      : null,
  ].filter(Boolean);

  const { text } = await generateText({
    model: openai(model),
    system: buildSystemPrompt(voice, guardrails),
    prompt: userParts.join("\n\n"),
    temperature: 0.7,
  });

  const body = text.trim();
  const lintWarnings = lintPost(body);

  return { body, lintWarnings };
}
