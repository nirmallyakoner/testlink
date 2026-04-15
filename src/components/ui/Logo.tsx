export function Logo({ className = "w-8 h-8" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="testlink-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#E63946" />
          <stop offset="100%" stopColor="#FF6B6B" />
        </linearGradient>
        <linearGradient id="testlink-grad-link" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#a8a8bf" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#e2e2ec" stopOpacity="0.8" />
        </linearGradient>
      </defs>

      {/* The background 'link' loop */}
      <path
        d="M25 45 C 10 45, 10 75, 25 75 L 45 75 C 60 75, 60 45, 45 45 Z"
        stroke="url(#testlink-grad-link)"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* The foreground checkmark that forms the other half of the 'link' */}
      <path
        d="M 35 55 L 55 75 L 85 25"
        stroke="url(#testlink-grad-main)"
        strokeWidth="16"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
