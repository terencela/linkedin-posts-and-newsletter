# HANDOFF.md

## State

Postcraft V1 dashboard runs locally with a Swiss editorial UI redesign. Next.js app: Compose, Queue, Batch. APIs unchanged.

## Done

- Next.js app: compose, generate, queue, batch, copy, schedule datetime
- API: `/api/generate`, `/api/posts`, `/api/batch`
- Voice loaded from `~/.ai-os/MY-VOICE.md` + `POST-GUARDRAILS.compact.md`
- Posts stored in `data/posts.json`
- Lint: banned words, verneinungen, fragment stacks
- **UI redesign (May 2026):** warm ink palette, signal orange CTAs, Geist typography, LinkedIn paste preview card, queue status pipeline strip, mobile bottom nav, reusable `src/components/ui/*`, design tokens in `globals.css`, system doc in `.interface-design/system.md`

## Run

```bash
cp .env.example .env.local
# OPENAI_API_KEY=sk-...
npm run dev
```

Open http://localhost:3000

## Next

- Deploy Vercel (bundle voice files or set VOICE_OS_PATH)
- Supabase instead of JSON file
- Regenerate lint on edit client-side
