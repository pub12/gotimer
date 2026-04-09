"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type JoinDialogProps = {
  challenge_id: string;
  on_joined: () => void;
  on_close: () => void;
};

export function JoinDialog({ challenge_id, on_joined, on_close }: JoinDialogProps) {
  const [join_code, set_join_code] = useState("");
  const [submitting, set_submitting] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  const handle_submit = async () => {
    if (!join_code.trim()) return;
    set_submitting(true);
    set_error(null);

    try {
      const res = await fetch(`/api/challenges/${challenge_id}/join`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ join_code: join_code.trim().toUpperCase() }),
      });

      if (res.ok) {
        on_joined();
      } else {
        const data = await res.json();
        set_error(data.error || "Failed to join challenge");
      }
    } catch {
      set_error("Failed to join challenge");
    } finally {
      set_submitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl p-6 shadow-xl border w-full max-w-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Join Challenge</h2>
          <button
            onClick={on_close}
            className="text-muted-foreground hover:text-foreground bg-transparent border-none cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-sm text-muted-foreground mb-4">
          Enter the join code shared by the challenge creator.
        </p>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Join Code</label>
            <input
              type="text"
              value={join_code}
              onChange={(e) => set_join_code(e.target.value.toUpperCase())}
              onKeyDown={(e) => e.key === "Enter" && handle_submit()}
              placeholder="e.g. TIMER-1234"
              className="w-full p-3 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring font-mono tracking-widest"
              autoFocus
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={on_close}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!join_code.trim() || submitting}
              onClick={handle_submit}
            >
              {submitting ? "Joining..." : "Join"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
