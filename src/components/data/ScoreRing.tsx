import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function useCountUp(target: number, duration = 900) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function ScoreRing({
  score,
  size = 180,
  label,
  suffix = "/ 100",
  className,
}: {
  score: number;
  size?: number;
  label?: string;
  suffix?: string;
  className?: string;
}) {
  const animated = useCountUp(score);
  const stroke = size > 120 ? 10 : 8;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;

  return (
    <div className={cn("relative inline-flex items-center justify-center", className)}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id="rp-ring" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="oklch(0.68 0.2 292)" />
            <stop offset="100%" stopColor="oklch(0.65 0.16 250)" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          className="stroke-border"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          strokeWidth={stroke}
          strokeLinecap="round"
          stroke="url(#rp-ring)"
          strokeDasharray={c}
          strokeDashoffset={c - (c * animated) / 100}
          style={{ transition: "stroke-dashoffset 120ms linear" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span
          className="font-semibold tabular-nums text-foreground"
          style={{ fontSize: size / 3.6 }}
        >
          {animated}
        </span>
        <span className="text-xs text-muted-foreground">{suffix}</span>
        {label ? (
          <span className="mt-1 text-[11px] uppercase tracking-widest text-muted-foreground">
            {label}
          </span>
        ) : null}
      </div>
    </div>
  );
}
