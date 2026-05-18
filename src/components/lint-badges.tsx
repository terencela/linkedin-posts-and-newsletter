import { AlertTriangle } from "lucide-react";

interface LintBadgesProps {
  warnings: string[];
}

export function LintBadges({ warnings }: LintBadgesProps) {
  if (warnings.length === 0) {
    return <p className="text-xs text-emerald-500/90">Lint: clean</p>;
  }

  return (
    <div className="space-y-1 rounded-md border border-amber-500/30 bg-amber-500/5 p-3">
      <p className="flex items-center gap-1.5 text-xs font-medium text-amber-400">
        <AlertTriangle className="h-3.5 w-3.5" />
        {warnings.length} lint warning{warnings.length > 1 ? "s" : ""}
      </p>
      <ul className="space-y-0.5 text-xs text-amber-200/80">
        {warnings.map((w) => (
          <li key={w}>{w}</li>
        ))}
      </ul>
    </div>
  );
}
