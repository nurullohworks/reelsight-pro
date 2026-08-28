import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export function MetricBar({
  label,
  score,
  max = 100,
  suffix = "/100",
  className,
}: {
  label: string;
  score: number;
  max?: number;
  suffix?: string;
  className?: string;
}) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setWidth((score / max) * 100), 60);
    return () => clearTimeout(t);
  }, [score, max]);

  const tone =
    score >= 80 ? "bg-success" : score >= 65 ? "bg-primary" : score >= 50 ? "bg-warning" : "bg-destructive";

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-baseline justify-between text-sm">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium tabular-nums text-foreground">
          {score}
          <span className="text-muted-foreground">{suffix}</span>
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-[width] duration-700 ease-out", tone)}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  );
}
