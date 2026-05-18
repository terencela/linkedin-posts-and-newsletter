# Postcraft

LinkedIn post dashboard for [terencela](https://www.linkedin.com/in/terencela).

Generate, store, copy-paste, batch, schedule.

**Voice rules:** `~/.ai-os/MY-VOICE.md` + `POST-GUARDRAILS.compact.md`

## Run locally

```bash
cp .env.example .env.local
# add OPENAI_API_KEY
npm install
npm run dev
```

Open http://localhost:3000

## Env

| Variable | Required | Description |
|----------|----------|-------------|
| `OPENAI_API_KEY` | Yes | For generation |
| `VOICE_OS_PATH` | No | Default `~/.ai-os` |
| `OPENAI_MODEL` | No | Default `gpt-4o` |

Posts stored in `data/posts.json` (V1).
