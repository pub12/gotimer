"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { use_auth_status } from "hazo_auth/client";
import { ArrowLeft } from "lucide-react";

export default function CreateChallengePage() {
  const router = useRouter();
  const { authenticated, loading: is_loading } = use_auth_status();
  const [name, set_name] = useState("");
  const [description, set_description] = useState("");
  const [saving, set_saving] = useState(false);
  const [created_id, set_created_id] = useState<string | null>(null);
  const [invite_url, set_invite_url] = useState<string | null>(null);
  const [copied, set_copied] = useState(false);

  useEffect(() => {
    if (!is_loading && !authenticated) {
      localStorage.setItem("redirect_after_login", "/challenges/create");
      router.push("/hazo_auth/login");
    }
  }, [authenticated, is_loading, router]);

  const handle_create = async () => {
    if (!name.trim()) return;
    set_saving(true);

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), description: description.trim() }),
      });

      if (res.ok) {
        const challenge = await res.json();
        set_created_id(challenge.id);

        // Generate invite link
        const invite_res = await fetch(
          `/api/challenges/${challenge.id}/invite`,
          { method: "POST" }
        );
        if (invite_res.ok) {
          const invite = await invite_res.json();
          set_invite_url(invite.invite_url);
        }
      }
    } finally {
      set_saving(false);
    }
  };

  const copy_link = () => {
    if (invite_url) {
      navigator.clipboard.writeText(invite_url);
      set_copied(true);
      setTimeout(() => set_copied(false), 2000);
    }
  };

  if (is_loading) {
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
          onClick={() => router.push("/challenges")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </button>

        {!created_id ? (
          <div className="bg-card rounded-xl p-6 shadow-sm border">
            <h1 className="text-2xl font-bold mb-6">Create a Challenge</h1>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Challenge Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => set_name(e.target.value)}
                  placeholder="e.g., Chess Masters, Catan Showdown"
                  className="w-full p-3 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  maxLength={100}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Description (optional)
                </label>
                <textarea
                  value={description}
                  onChange={(e) => set_description(e.target.value)}
                  placeholder="What game are you playing? Any special rules?"
                  className="w-full p-3 border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                  rows={3}
                />
              </div>

              <Button
                className="w-full"
                disabled={!name.trim() || saving}
                onClick={handle_create}
              >
                {saving ? "Creating..." : "Create Challenge"}
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-card rounded-xl p-6 shadow-sm border text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Challenge Created!</h2>
            <p className="text-muted-foreground mb-6">
              Share this link with your friend so they can join:
            </p>

            {invite_url && (
              <div className="mb-6">
                <div className="bg-muted rounded-lg p-3 text-sm font-mono break-all mb-3">
                  {invite_url}
                </div>
                <Button onClick={copy_link} variant="outline" className="w-full">
                  {copied ? "Copied!" : "Copy Invite Link"}
                </Button>
              </div>
            )}

            <Button
              className="w-full"
              onClick={() => router.push(`/challenges/${created_id}`)}
            >
              Go to Challenge
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
