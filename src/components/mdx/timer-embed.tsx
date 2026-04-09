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
    <div className="my-6 flex items-center gap-4 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
        <Timer className="h-5 w-5 text-blue-600 dark:text-blue-400" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
          {label} Timer
          {duration ? ` (${duration}s)` : ""}
        </p>
        <p className="text-xs text-blue-700 dark:text-blue-300">
          Free online timer — no signup required
        </p>
      </div>
      <Link
        href={href}
        className="shrink-0 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700"
      >
        Try the {label} timer &rarr;
      </Link>
    </div>
  );
}
