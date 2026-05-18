"use client";

import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const buttonVariants = cva(
  "inline-flex h-11 items-center justify-center gap-2 rounded-sm px-4 text-sm font-medium transition-colors duration-200 focus-ring disabled:pointer-events-none disabled:opacity-40 motion-safe:active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary: "bg-signal text-ink hover:brightness-110",
        secondary:
          "border border-line bg-surface text-paper hover:border-paper-muted/50 hover:bg-surface-raised",
        ghost: "text-paper-muted hover:bg-surface-raised hover:text-paper",
        danger:
          "border border-danger/40 bg-danger-dim text-paper hover:border-danger/60",
        ready:
          "border border-ready/40 bg-ready-dim text-ready hover:border-ready/60",
      },
      size: {
        default: "h-11 px-4",
        sm: "h-9 px-3 text-xs",
        icon: "h-11 w-11 shrink-0 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

export function Button({
  className,
  variant,
  size,
  loading,
  disabled,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
      {children}
    </button>
  );
}
