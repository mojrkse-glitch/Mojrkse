import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const styles = {
  default: "bg-primary/15 text-primary border-primary/20",
  success: "bg-success/15 text-success border-success/20",
  warning: "bg-warning/15 text-warning border-warning/20",
  danger: "bg-danger/15 text-danger border-danger/20",
  muted: "bg-white/5 text-muted-foreground border-border"
};

export function Badge({
  children,
  variant = "default",
  className
}: {
  children: ReactNode;
  variant?: keyof typeof styles;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-semibold",
        styles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
