const BANNED_WORDS = [
  "leverage",
  "seamless",
  "transformative",
  "robust",
  "game-changer",
  "game changer",
  "unlock",
  "dive into",
  "cutting-edge",
  "cutting edge",
  "revolutionize",
  "crucial",
  "powerful solution",
  "navigate the landscape",
  "in today's fast-paced world",
  "state-of-the-art",
  "disrupting",
  "it's important to",
  "as we can see",
];

const VERNEINUNG = /\bnot\b[^.]{0,80}\b(it'?s|it is)\b/i;
const FRAGMENT_STACK = /^[^.!?]{1,40}[.!?]?\s*$/m;

export function lintPost(body: string): string[] {
  const warnings: string[] = [];
  const lower = body.toLowerCase();

  for (const word of BANNED_WORDS) {
    if (lower.includes(word)) {
      warnings.push(`Banned word: "${word}"`);
    }
  }

  if (body.includes("—")) {
    warnings.push("Em dash found. Use hyphens or periods.");
  }

  const lines = body.split("\n").filter((l) => l.trim());
  let shortRun = 0;
  for (const line of lines) {
    const trimmed = line.trim();
    if (trimmed.length > 0 && trimmed.length < 35 && !trimmed.startsWith("-")) {
      shortRun += 1;
      if (shortRun >= 4) {
        warnings.push("Possible staccato / fragment stack (4+ short lines).");
        break;
      }
    } else {
      shortRun = 0;
    }
  }

  if (VERNEINUNG.test(body)) {
    warnings.push('Possible verneinung ("not X, it\'s Y").');
  }

  const sentences = body.split(/[.!?]+/).filter(Boolean);
  if (sentences.length >= 3) {
    const starts = sentences.map((s) => s.trim().split(/\s+/)[0]?.toLowerCase());
    for (let i = 0; i <= starts.length - 4; i++) {
      if (
        starts[i] &&
        starts[i] === starts[i + 1] &&
        starts[i] === starts[i + 2] &&
        starts[i] === starts[i + 3]
      ) {
        warnings.push("Anaphora abuse: 4 sentences start the same way.");
        break;
      }
    }
  }

  return [...new Set(warnings)];
}

export function titleFromBody(body: string): string {
  const first = body.split("\n").find((l) => l.trim())?.trim() ?? "Untitled";
  return first.length > 72 ? `${first.slice(0, 69)}...` : first;
}
