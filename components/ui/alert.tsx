import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Alert({
  className,
  children
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-primary/20 bg-primary/10 p-4 text-sm text-foreground",
        className
      )}
    >
      {children}
    </div>
  );
}
