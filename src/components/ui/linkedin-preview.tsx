"use client";

import { cn } from "@/lib/utils";

interface LinkedInPreviewProps {
  body: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
  placeholder?: string;
  readOnly?: boolean;
  className?: string;
}

const MAX_CHARS = 3000;

export function LinkedInPreview({
  body,
  onChange,
  onBlur,
  placeholder = "Generated post appears here. Edit freely.",
  readOnly = false,
  className,
}: LinkedInPreviewProps) {
  const charCount = body.length;
  const overLimit = charCount > MAX_CHARS;

  return (
    <article
      className={cn(
        "overflow-hidden rounded-sm border border-line bg-surface-raised shadow-[inset_0_1px_0_rgba(244,240,232,0.06)]",
        className,
      )}
    >
      <header className="flex items-center gap-3 border-b border-line px-4 py-3">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-signal/20 font-mono text-xs font-semibold text-signal"
          aria-hidden
        >
          TL
        </div>
        <div>
          <p className="text-sm font-semibold leading-tight text-paper">
            Terence La
          </p>
          <p className="text-xs text-paper-muted">Paste-ready preview</p>
        </div>
        <span
          className={cn(
            "ml-auto font-mono text-[11px] tabular-nums tracking-wide",
            overLimit ? "text-danger" : "text-paper-muted",
          )}
        >
          {charCount.toLocaleString()}
        </span>
      </header>

      {readOnly ? (
        <div className="min-h-[280px] whitespace-pre-wrap px-4 py-4 text-[15px] leading-[1.55] text-paper">
          {body || (
            <span className="text-paper-muted/60">{placeholder}</span>
          )}
        </div>
      ) : (
        <textarea
          value={body}
          onChange={(e) => onChange?.(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          rows={14}
          className="min-h-[280px] w-full resize-y border-0 bg-transparent px-4 py-4 text-[15px] leading-[1.55] text-paper placeholder:text-paper-muted/50 focus:outline-none focus-ring"
          aria-label="Post body"
        />
      )}

      <footer className="border-t border-line px-4 py-2">
        <p className="font-mono text-[10px] uppercase tracking-widest text-paper-muted">
          Copy uses LinkedIn line breaks
        </p>
      </footer>
    </article>
  );
}
