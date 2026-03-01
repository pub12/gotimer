"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { use_auth_status } from "hazo_auth/client";
import { GifPicker } from "@/components/challenges/gif-picker";
import { ArrowLeft, Trash2, Image, X } from "lucide-react";

export default function EditChallengePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { authenticated, loading: auth_loading } = use_auth_status();
  const [name, set_name] = useState("");
  const [description, set_description] = useState("");
  const [gif_url, set_gif_url] = useState("");
  const [show_gif_picker, set_show_gif_picker] = useState(false);
  const [status, set_status] = useState("active");
  const [loading, set_loading] = useState(true);
  const [saving, set_saving] = useState(false);
  const [is_creator, set_is_creator] = useState(false);
  const [confirm_delete, set_confirm_delete] = useState(false);

  useEffect(() => {
    if (auth_loading || !authenticated) return;

    fetch(`/api/challenges/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => {
        set_name(data.name);
        set_description(data.description || "");
        set_gif_url(data.gif_url || "");
        set_status(data.status);

        // Check if current user is creator
        fetch("/api/hazo_auth/me")
          .then((res) => res.json())
          .then((me) => {
            if (me.user) {
              set_is_creator(data.created_by === me.user.id);
            }
          });
      })
      .catch(() => router.push("/challenges"))
      .finally(() => set_loading(false));
  }, [id, authenticated, auth_loading, router]);

  const handle_save = async () => {
    set_saving(true);
    try {
      const res = await fetch(`/api/challenges/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description, gif_url: gif_url || "", status }),
      });
      if (res.ok) {
        router.push(`/challenges/${id}`);
      }
    } finally {
      set_saving(false);
    }
  };

  const handle_delete = async () => {
    const res = await fetch(`/api/challenges/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      router.push("/challenges");
    }
  };

  if (loading || auth_loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />

      <div className="w-full max-w-lg mx-auto">
        <button
          onClick={() => router.push(`/challenges/${id}`)}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Challenge
        </button>

        <div className="bg-card rounded-xl p-6 shadow-sm border">
          <h1 className="text-2xl font-bold mb-6">Edit Challenge</h1>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => set_name(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                maxLength={100}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => set_description(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                rows={3}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Theme GIF
              </label>
              {gif_url ? (
                <div className="relative">
                  <img
                    src={gif_url}
                    alt="Selected GIF"
                    className="w-full rounded-lg max-h-48 object-cover"
                  />
                  <button
                    onClick={() => set_gif_url("")}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black/80 cursor-pointer border-none"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={() => set_show_gif_picker(true)}
                >
                  <Image className="w-4 h-4 mr-2" />
                  Add Theme GIF
                </Button>
              )}
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Status</label>
              <select
                value={status}
                onChange={(e) => set_status(e.target.value)}
                className="w-full p-3 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="active">Active</option>
                <option value="completed">Completed</option>
                <option value="paused">Paused</option>
              </select>
            </div>

            <Button
              className="w-full"
              disabled={!name.trim() || saving}
              onClick={handle_save}
            >
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </div>

          {is_creator && (
            <div className="mt-8 pt-6 border-t">
              <h3 className="text-sm font-medium text-destructive mb-3">
                Danger Zone
              </h3>
              {confirm_delete ? (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Are you sure? This will delete the challenge and all game
                    history permanently.
                  </p>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => set_confirm_delete(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1"
                      onClick={handle_delete}
                    >
                      Delete Forever
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  className="w-full text-destructive border-destructive/50 hover:bg-destructive/10"
                  onClick={() => set_confirm_delete(true)}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete Challenge
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
