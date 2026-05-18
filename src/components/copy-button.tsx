"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toLinkedInText } from "@/lib/linkedin";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface CopyButtonProps {
  text: string;
  className?: string;
  label?: string;
  fullWidth?: boolean;
}

export function CopyButton({
  text,
  className,
  label = "Copy for LinkedIn",
  fullWidth,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    const linkedIn = toLinkedInText(text);
    await navigator.clipboard.writeText(linkedIn);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      variant="primary"
      onClick={handleCopy}
      disabled={!text.trim()}
      className={cn(fullWidth && "w-full sm:w-auto", className)}
      aria-label={copied ? "Copied to clipboard" : label}
    >
      {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      {copied ? "Copied" : label}
    </Button>
  );
}
