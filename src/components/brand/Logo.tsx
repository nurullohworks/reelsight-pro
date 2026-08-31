import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("h-8 w-8", className)} aria-hidden="true">
      <defs>
        <linearGradient id="rp-mark" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="oklch(0.68 0.2 292)" />
          <stop offset="100%" stopColor="oklch(0.6 0.16 255)" />
        </linearGradient>
      </defs>
      <rect x="1" y="1" width="30" height="30" rx="9" fill="url(#rp-mark)" opacity="0.16" />
      <rect
        x="1"
        y="1"
        width="30"
        height="30"
        rx="9"
        fill="none"
        stroke="url(#rp-mark)"
        strokeWidth="1.5"
      />
      <path d="M9 22.5 L13.5 14 L18 18.5 L23 9.5" fill="none" stroke="url(#rp-mark)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.5 9 L19.5 12.4 L13.5 15.8 Z" fill="url(#rp-mark)" opacity="0.9" />
    </svg>
  );
}

export function Logo({
  withTagline = false,
  className,
}: {
  withTagline?: boolean;
  className?: string;
}) {
  return (
    <Link to="/" className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      <span className="flex flex-col leading-none">
        <span className="text-[15px] font-semibold tracking-[0.14em] text-foreground">
          REELPREDICT
        </span>
        {withTagline ? (
          <span className="mt-1 text-[11px] text-muted-foreground">
            AI asosidagi Instagram samaradorlik intellekti
          </span>
        ) : null}
      </span>
    </Link>
  );
}
