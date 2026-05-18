import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface LintBadgesProps {
  warnings: string[];
  className?: string;
}

export function LintBadges({ warnings, className }: LintBadgesProps) {
  if (warnings.length === 0) {
    return (
      <p
        className={cn(
          "flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-widest text-ready",
          className,
        )}
      >
        <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
        Lint clean
      </p>
    );
  }

  return (
    <aside
      className={cn(
        "space-y-2 border-l-2 border-warn bg-warn-dim py-2 pl-3 pr-2",
        className,
      )}
      aria-live="polite"
    >
      <p className="flex items-center gap-1.5 font-mono text-[11px] font-medium uppercase tracking-widest text-warn">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" aria-hidden />
        {warnings.length} warning{warnings.length > 1 ? "s" : ""}
      </p>
      <ul className="space-y-1 text-xs leading-relaxed text-paper/90">
        {warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </aside>
  );
}
