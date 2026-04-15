"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none",
          "disabled:opacity-50 disabled:cursor-not-allowed",
          // Sizes
          size === "sm" && "text-sm px-4 py-2 rounded-lg gap-1.5",
          size === "md" && "text-sm px-5 py-2.5 rounded-lg gap-2",
          size === "lg" && "text-base px-7 py-3.5 rounded-xl gap-2.5",
          // Variants
          variant === "primary" &&
            "bg-primary text-white hover:bg-primary-light active:scale-[0.98] shadow-[0_0_20px_rgba(230,57,70,0.2)] hover:shadow-[0_0_30px_rgba(230,57,70,0.35)]",
          variant === "ghost" &&
            "text-text-secondary hover:text-text hover:bg-surface-2",
          variant === "outline" &&
            "border border-border text-text-secondary hover:border-border-hover hover:text-text",
          variant === "danger" &&
            "bg-error/10 text-error hover:bg-error/20",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export { Button };
