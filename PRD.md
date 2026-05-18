# PRD — Postcraft

## Problem

Terence needs fast idea-to-post with his voice, not AI slop. Copy-paste to LinkedIn. Batch 30, schedule across the month.

## V1 (ship this)

- Compose: rough notes in, one polished post out
- Queue: draft / ready / scheduled / posted
- Copy button: LinkedIn-safe text, no markdown artifacts
- Batch: multiple topics, generate many, review queue
- Schedule: pick date per post (reminder/copy queue; no LinkedIn API in v1)
- Generation loads `MY-VOICE.md` + `POST-GUARDRAILS.compact.md`
- Lint pass: banned words, verneinungen (from full guardrails rules)

## V2

- Auth, multi-user (SaaS)
- Auto-post via Buffer/Late if needed

## Not in scope

- Duplicating style guides in the repo
- Chat-only post workflow without the app

## Success

Terence pastes an idea, gets a post he would actually publish, in under 2 minutes.
