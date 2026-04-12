import Link from "next/link";
import { Timer } from "lucide-react";

interface TimerEmbedProps {
  type: string;
  duration?: number;
}

export function TimerEmbed({ type, duration }: TimerEmbedProps) {
  const href = `/${type}-timer`;
  const label = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="my-6 flex items-center gap-4 rounded-[0.75rem] bg-surface-container-low p-4 border-l-4 border-l-accent">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-container">
        <Timer className="h-5 w-5 text-accent" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-foreground">
          {label} Timer
          {duration ? ` (${duration}s)` : ""}
        </p>
        <p className="text-xs text-muted-foreground">
          Free online timer — no signup required
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 rounded-[0.5rem] bg-secondary px-4 py-2 text-sm font-medium text-white transition-all duration-200 ease-out hover:scale-105"
      >
        Try the {label} timer &rarr;
      </Link>
    </div>
  );
}
