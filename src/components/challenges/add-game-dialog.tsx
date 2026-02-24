"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { GifPicker } from "./gif-picker";
import { toast } from "sonner";
import { X, ImagePlus } from "lucide-react";

type Participant = {
  user_id: string;
  role: string;
};

type AddGameDialogProps = {
  challenge_id: string;
  participants: Participant[];
  user_names: Record<string, string>;
  user_pictures?: Record<string, string | null>;
  on_game_added: () => void;
  on_close: () => void;
};

export function AddGameDialog({
  challenge_id,
  participants,
  user_names,
  user_pictures,
  on_game_added,
  on_close,
}: AddGameDialogProps) {
  const [winner_id, set_winner_id] = useState<string | null>(null);
  const [is_draw, set_is_draw] = useState(false);
  const [notes, set_notes] = useState("");
  const [gif_url, set_gif_url] = useState<string | null>(null);
  const [show_gif_picker, set_show_gif_picker] = useState(false);
  const [saving, set_saving] = useState(false);

  const handle_submit = async () => {
    if (!is_draw && !winner_id) return;
    set_saving(true);

    try {
      const res = await fetch(`/api/challenges/${challenge_id}/games`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          winner_id: is_draw ? null : winner_id,
          is_draw,
          notes,
          gif_url,
        }),
      });

      if (res.ok) {
        on_game_added();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add game");
      }
    } catch {
      toast.error("Failed to add game");
    } finally {
      set_saving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold">Add Game Result</h3>
            <Button variant="ghost" size="icon" onClick={on_close}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                Who won?
              </label>
              <div className="flex flex-col gap-2">
                {participants.map((p) => {
                  const pic = user_pictures?.[p.user_id];
                  const name = user_names[p.user_id] || "Unknown";
                  return (
                    <button
                      key={p.user_id}
                      className={`p-3 rounded-lg border text-left transition-colors cursor-pointer flex items-center gap-3 ${
                        !is_draw && winner_id === p.user_id
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:border-primary/50"
                      }`}
                      onClick={() => {
                        set_winner_id(p.user_id);
                        set_is_draw(false);
                      }}
                    >
                      {pic ? (
                        <Image
                          src={pic}
                          alt={name}
                          width={32}
                          height={32}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-bold">
                          {name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className="font-medium">{name}</span>
                    </button>
                  );
                })}
                <button
                  className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
                    is_draw
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => {
                    set_is_draw(true);
                    set_winner_id(null);
                  }}
                >
                  <span className="font-medium">Draw</span>
                </button>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => set_notes(e.target.value)}
                placeholder="Epic comeback in the last round..."
                className="w-full p-3 border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={2}
              />
            </div>

            {gif_url ? (
              <div className="relative">
                <img
                  src={gif_url}
                  alt="Selected GIF"
                  className="w-full rounded-lg max-h-40 object-cover"
                />
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute top-2 right-2 h-7 w-7"
                  onClick={() => set_gif_url(null)}
                >
                  <X className="w-3.5 h-3.5" />
                </Button>
              </div>
            ) : show_gif_picker ? (
              <GifPicker
                on_select={(url) => {
                  set_gif_url(url);
                  set_show_gif_picker(false);
                }}
                on_close={() => set_show_gif_picker(false)}
              />
            ) : (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => set_show_gif_picker(true)}
              >
                <ImagePlus className="w-4 h-4 mr-2" />
                Add GIF
              </Button>
            )}
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={on_close}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!is_draw && !winner_id}
              onClick={handle_submit}
            >
              {saving ? "Saving..." : "Add Game"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
