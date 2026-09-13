import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("relative flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 to-emerald-400 p-0.5 shadow-lg shadow-cyan-500/20", className)}>
      <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-background/90 backdrop-blur-sm">
        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-none stroke-cyan-400 stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" className="fill-cyan-400/20" />
        </svg>
      </div>
    </div>
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
    <Link to="/" className={cn("flex items-center gap-2.5 group transition-transform active:scale-95", className)}>
      <LogoMark />
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span className="text-base font-extrabold tracking-tight text-foreground group-hover:text-primary transition-colors">
            NEXREEL
          </span>
          <span className="rounded-md bg-gradient-to-r from-cyan-500/20 to-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-cyan-400 border border-cyan-500/30">
            AI
          </span>
        </div>
        {withTagline ? (
          <span className="mt-1 text-[11px] text-muted-foreground font-medium">
            Meta Reels Algoritmi & Virallik Diagnostikasi
          </span>
        ) : null}
      </div>
    </Link>
  );
}
