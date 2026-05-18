import { cn } from "@/lib/utils";

export function FieldLabel({
  children,
  htmlFor,
  hint,
}: {
  children: React.ReactNode;
  htmlFor?: string;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="mb-2 block">
      <span className="font-mono text-[11px] font-medium uppercase tracking-widest text-paper-muted">
        {children}
      </span>
      {hint ? (
        <span className="mt-0.5 block font-sans text-xs font-normal normal-case tracking-normal text-paper-muted/80">
          {hint}
        </span>
      ) : null}
    </label>
  );
}

export function TextArea({
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-y rounded-sm border border-line bg-ink px-3 py-2.5 text-[15px] leading-relaxed text-paper placeholder:text-paper-muted/50 focus-ring focus:border-paper-muted/40",
        className,
      )}
      {...props}
    />
  );
}

export function Input({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-sm border border-line bg-ink px-3 text-sm text-paper placeholder:text-paper-muted/50 focus-ring focus:border-paper-muted/40",
        className,
      )}
      {...props}
    />
  );
}
