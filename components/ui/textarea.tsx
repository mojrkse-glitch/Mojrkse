import * as React from "react";
import { cn } from "@/lib/utils";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "min-h-[120px] w-full rounded-2xl border border-border bg-white/[0.03] px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary/60 focus:ring-2 focus:ring-primary/20",
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = "Textarea";
