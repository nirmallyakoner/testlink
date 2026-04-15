import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className, hover = false }: CardProps) {
  return (
    <div
      className={cn(
        "bg-surface border border-border rounded-xl p-6",
        hover && "hover-lift cursor-pointer hover:border-border-hover",
        className
      )}
    >
      {children}
    </div>
  );
}
