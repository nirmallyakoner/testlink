import { cn } from "@/lib/utils";

interface BadgeProps {
  rank: number;
  className?: string;
}

export function RankBadge({ rank, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center justify-center font-mono font-bold text-xs min-w-[28px] h-7 rounded-full px-2",
        rank === 1 && "bg-gold/15 text-gold border border-gold/30",
        rank === 2 && "bg-silver/15 text-silver border border-silver/30",
        rank === 3 && "bg-bronze/15 text-bronze border border-bronze/30",
        rank > 3 && "bg-surface-2 text-text-secondary border border-border",
        className
      )}
    >
      #{rank}
    </span>
  );
}
