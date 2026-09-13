import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <div className={cn("cyber-prism relative flex h-9 w-9 items-center justify-center", className)}>
      <div className="cyber-prism__frame absolute inset-0" />
      <div className="cyber-prism__core relative flex h-7 w-7 items-center justify-center bg-background/90">
        <svg viewBox="0 0 32 32" className="h-5 w-5 fill-none" aria-hidden="true">
          <path d="M16 3 28 10v12l-12 7L4 22V10L16 3Z" className="stroke-primary" strokeWidth="1.5" />
          <path d="m16 3 4.5 12.5L16 29l-4.5-13.5L16 3Z" className="fill-primary/20 stroke-primary" strokeWidth="1.2" />
          <path d="m4 10 7.5 5.5L4 22m24-12-7.5 5.5L28 22" className="stroke-signal" strokeWidth="1.2" />
          <circle cx="16" cy="16" r="2" className="fill-foreground" />
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
          <span className="font-display text-base font-extrabold text-foreground transition-colors group-hover:text-primary">
            NEXREEL
          </span>
          <span className="border border-primary/40 bg-primary/10 px-1.5 py-0.5 text-[9px] font-mono font-bold text-primary">
            AI
          </span>
        </div>
        {withTagline ? (
          <span className="mt-1 text-[11px] text-muted-foreground font-medium">
            Instagram signallari bo‘yicha aniq tahlil
          </span>
        ) : null}
      </div>
    </Link>
  );
}
