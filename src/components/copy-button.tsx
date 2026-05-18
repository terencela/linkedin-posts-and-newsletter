"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toLinkedInText } from "@/lib/linkedin";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
}

export function CopyButton({ text, className, label = "Copy for LinkedIn" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const linkedIn = toLinkedInText(text);
    await navigator.clipboard.writeText(linkedIn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-900 transition hover:bg-white",
        className,
      )}
    >
      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      {copied ? "Copied" : label}
    </button>
  );
}
