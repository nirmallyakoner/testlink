import { cn } from "@/lib/utils";

interface AvatarProps {
  name: string;
  imageUrl?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const COLORS = [
  "bg-primary/20 text-primary",
  "bg-gold/20 text-gold",
  "bg-success/20 text-success",
  "bg-info/20 text-info",
  "bg-bronze/20 text-bronze",
];

function getColorFromName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COLORS[Math.abs(hash) % COLORS.length];
}

export function Avatar({ name, imageUrl, size = "md", className }: AvatarProps) {
  const initial = name.charAt(0).toUpperCase();
  const sizeClasses = {
    sm: "w-7 h-7 text-xs",
    md: "w-9 h-9 text-sm",
    lg: "w-12 h-12 text-base",
  };

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={cn(
          "rounded-full object-cover border border-border",
          sizeClasses[size],
          className
        )}
      />
    );
  }

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold border border-border/50",
        sizeClasses[size],
        getColorFromName(name),
        className
      )}
    >
      {initial}
    </div>
  );
}
