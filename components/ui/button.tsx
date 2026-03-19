import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline" | "ghost" | "danger";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  asChild?: boolean;
}

const variantClasses: Record<Variant, string> = {
  default:
    "bg-primary text-primary-foreground hover:opacity-90 shadow-glow",
  secondary:
    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
  outline:
    "border border-border bg-transparent text-foreground hover:bg-white/5",
  ghost:
    "bg-transparent text-foreground hover:bg-white/5",
  danger:
    "bg-danger text-white hover:opacity-90"
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", type = "button", ...props }, ref) => {
    const resolvedVariant = variant as Variant;

    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          "inline-flex h-11 items-center justify-center rounded-2xl px-5 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:pointer-events-none disabled:opacity-50",
          variantClasses[resolvedVariant],
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
