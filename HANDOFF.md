# HANDOFF.md

## State

Postcraft V1 dashboard runs locally. Next.js app with Compose, Queue, Batch tabs.

## Done

- Next.js app: compose, generate, queue, batch, copy, schedule datetime
- API: `/api/generate`, `/api/posts`, `/api/batch`
- Voice loaded from `~/.ai-os/MY-VOICE.md` + `POST-GUARDRAILS.compact.md`
- Posts stored in `data/posts.json`
- Lint: banned words, verneinungen, fragment stacks

## Run

```bash
cp .env.example .env.local
# OPENAI_API_KEY=sk-...
npm run dev
```

## Next

- Deploy Vercel (bundle voice files or set VOICE_OS_PATH)
- Supabase instead of JSON file
- Regenerate lint on edit client-side
