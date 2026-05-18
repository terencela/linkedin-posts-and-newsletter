import { promises as fs } from "fs";
import os from "os";
import path from "path";

const DEFAULT_VOICE_DIR = path.join(os.homedir(), ".ai-os");

export async function loadVoicePack(): Promise<{ voice: string; guardrails: string }> {
  const dir = process.env.VOICE_OS_PATH?.trim() || DEFAULT_VOICE_DIR;
  const [voice, guardrails] = await Promise.all([
    fs.readFile(path.join(dir, "MY-VOICE.md"), "utf-8"),
    fs.readFile(path.join(dir, "POST-GUARDRAILS.compact.md"), "utf-8"),
  ]);
  return { voice, guardrails };
}

export function buildSystemPrompt(voice: string, guardrails: string): string {
  return `You write LinkedIn posts as Terence La.

${guardrails}

---

${voice}

---

Output rules:
- Return ONLY the post body. No title, no preamble, no "Here's your post".
- One polished post. Not multiple options.
- Preserve any fixed lines or numbers from the user's notes exactly.
- Natural reflective flow. No verneinungen, no aphorism stacks, no guru punchlines.
- End when the point is made. No engagement bait.`;
}
