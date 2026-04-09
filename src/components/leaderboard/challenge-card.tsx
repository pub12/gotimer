import React from "react";
import Link from "next/link";
import { Users, Clock, Trophy } from "lucide-react";

type ChallengeCardProps = {
  id: string;
  name: string;
  description: string;
  format: string;
  timer_type: string | null;
  participant_count: number;
  updated_at: string;
};

export function ChallengeCard({
  id,
  name,
  description,
  format,
  timer_type,
  participant_count,
  updated_at,
}: ChallengeCardProps) {
  const format_label =
    format === "head-to-head" ? "1v1" : format.charAt(0).toUpperCase() + format.slice(1);

  const time_ago = (() => {
    const diff_ms = Date.now() - new Date(updated_at).getTime();
    const diff_days = Math.floor(diff_ms / (1000 * 60 * 60 * 24));
    if (diff_days === 0) return "today";
    if (diff_days === 1) return "yesterday";
    if (diff_days < 7) return `${diff_days}d ago`;
    return `${Math.floor(diff_days / 7)}w ago`;
  })();

  return (
    <Link
      href={`/public-challenges/${id}`}
      className="block bg-card rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow"
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <h3 className="font-semibold text-foreground line-clamp-1">{name}</h3>
        <span className="shrink-0 text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">
          {format_label}
        </span>
      </div>

      {description && (
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{description}</p>
      )}

      <div className="flex items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {participant_count} {participant_count === 1 ? "player" : "players"}
        </span>
        {timer_type && (
          <span className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {timer_type.replace(/-/g, " ")}
          </span>
        )}
        <span className="flex items-center gap-1 ml-auto">
          <Trophy className="w-3 h-3" />
          {time_ago}
        </span>
      </div>
    </Link>
  );
}
