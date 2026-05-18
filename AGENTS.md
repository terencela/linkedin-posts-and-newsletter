# AGENTS.md — LinkedIn Posts and Newsletter

## Mission

Build the **Postcraft dashboard**: generate LinkedIn posts, store them, copy-paste to LinkedIn, batch create, schedule. Personal tool first, SaaS later.

## Read first

1. PRD.md
2. HANDOFF.md
3. `~/.ai-os/MY-VOICE.md` + `~/.ai-os/POST-GUARDRAILS.compact.md` (when generating copy)

Style guides live in **`~/.ai-os/`**, not in this repo.

## When Terence asks for a post in chat

Load MY-VOICE + POST-GUARDRAILS.compact, generate one draft. Do not spawn extra markdown files.

## Hard rules

- Ship the dashboard, not documentation dumps
- Do not paraphrase fixed lines; do not flatten emphasis
- Re-read whole post before delivering

## Stack

Next.js App Router, TypeScript, Tailwind, Supabase (later), Vercel AI SDK, file storage V1
