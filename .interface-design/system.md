# Postcraft Design System

## Intent

**Who:** Terence La between meetings. Rough notes in, paste-ready LinkedIn post out.

**Job:** Generate, lint, queue, copy, schedule. No fluff.

**Feel:** Swiss editorial utility. Newsprint and ink. Sharp type, warm neutrals, one signal accent. Not a generic SaaS dashboard.

## Domain

Compose, queue, batch, voice guardrails, paste to LinkedIn, schedule slot, status pipeline.

## Color world

| Token | Value | Use |
|-------|-------|-----|
| `--ink` | `#0a0908` | Page background |
| `--surface` | `#141210` | Panels |
| `--surface-raised` | `#1e1b18` | Cards, preview |
| `--paper` | `#f4f0e8` | Primary text |
| `--paper-muted` | `#a39e96` | Secondary text |
| `--line` | `#2e2a26` | Borders, dividers |
| `--signal` | `#e85d04` | Primary CTA (Generate, Copy) |
| `--signal-dim` | `#e85d0418` | Accent backgrounds |
| `--ready` | `#3d9a6a` | Ready / clean lint |
| `--warn` | `#d4a017` | Lint warnings |
| `--danger` | `#c94c4c` | Errors, delete |

No purple gradients. No pure `#000`. No Inter (Geist + Geist Mono).

## Typography

- **Display / UI:** Geist Sans, `tracking-tight`
- **Labels / metrics / pipeline:** Geist Mono, `text-[11px] uppercase tracking-widest`
- **Body:** 15px, `leading-relaxed`
- **Preview post:** 15px, `leading-[1.55]` (LinkedIn-like)

## Signature element

**LinkedIn paste preview card** — profile row (initials), editable body in a raised “post shell”, character count, subtle top rule. Makes output feel publish-ready, not a generic textarea.

**Status pipeline strip** — mono labels, dot connectors, count per status. Queue scannable at a glance.

## Spacing & touch

- Min tap height: `h-11` (44px)
- Page max width: `72rem`
- Section gap: `gap-6` / `gap-8`
- Mobile: single column; bottom tab bar on small screens

## Motion

- `transition-colors duration-200` on interactive
- `active:scale-[0.98]` on primary buttons
- `prefers-reduced-motion`: no scale

## Defaults replaced

| Default | Replacement |
|---------|-------------|
| Zinc dark + white pill tabs | Warm ink + underline tab rail |
| Equal 2-col card grid | Compose: input stack + preview card |
| Generic bordered list cards | Left status rail + pipeline strip |
| Gray primary button | Signal orange CTA |
| Emoji / purple AI aesthetic | Lucide icons, editorial palette |
