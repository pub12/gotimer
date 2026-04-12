"use client";

import React, { Suspense, useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { use_auth_status } from "hazo_auth/client";
import { GifPicker } from "@/components/challenges/gif-picker";
import { ArrowLeft, Image, X, ChevronDown, Plus } from "lucide-react";

const VALID_FORMATS = ["head-to-head", "group", "solo"] as const;
type ChallengeFormat = (typeof VALID_FORMATS)[number];

function CreateChallengeForm() {
  const router = useRouter();
  const search_params = useSearchParams();
  const { authenticated, loading: is_loading } = use_auth_status();
  const [name, set_name] = useState("");
  const [description, set_description] = useState("");
  const [gif_url, set_gif_url] = useState("");
  const [show_gif_picker, set_show_gif_picker] = useState(false);
  const [saving, set_saving] = useState(false);
  const [created_id, set_created_id] = useState<string | null>(null);
  const [invite_url, set_invite_url] = useState<string | null>(null);
  const [is_public, set_is_public] = useState(true);
  const [copied, set_copied] = useState(false);
  const [games, set_games] = useState<{ id: string; name: string }[]>([]);
  const [selected_game_id, set_selected_game_id] = useState<string | null>(null);
  const [game_search, set_game_search] = useState("");
  const [show_game_dropdown, set_show_game_dropdown] = useState(false);
  const [adding_game, set_adding_game] = useState(false);
  const game_dropdown_ref = useRef<HTMLDivElement>(null);

  // Pre-fill from query params
  const [format, set_format] = useState<ChallengeFormat>("head-to-head");
  const [timer_type, set_timer_type] = useState<string>("");
  const [join_code, set_join_code] = useState<string | null>(null);

  useEffect(() => {
    const qp_timer_type = search_params.get("timer_type");
    const qp_format = search_params.get("format") as ChallengeFormat | null;
    if (qp_timer_type) set_timer_type(qp_timer_type);
    if (qp_format && VALID_FORMATS.includes(qp_format)) set_format(qp_format);
  }, [search_params]);

  useEffect(() => {
    const handle_click_outside = (e: MouseEvent) => {
      if (game_dropdown_ref.current && !game_dropdown_ref.current.contains(e.target as Node)) {
        set_show_game_dropdown(false);
      }
    };
    document.addEventListener("mousedown", handle_click_outside);
    return () => document.removeEventListener("mousedown", handle_click_outside);
  }, []);

  useEffect(() => {
    if (!is_loading && !authenticated) {
      localStorage.setItem("redirect_after_login", "/challenges/create");
      router.push("/hazo_auth/login");
    }
  }, [authenticated, is_loading, router]);

  useEffect(() => {
    if (authenticated) {
      fetch("/api/games")
        .then((res) => (res.ok ? res.json() : []))
        .then(set_games);
    }
  }, [authenticated]);

  const handle_create = async () => {
    if (!name.trim()) return;
    set_saving(true);

    try {
      const res = await fetch("/api/challenges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          gif_url: gif_url || undefined,
          is_public,
          game_id: selected_game_id || undefined,
          format,
          timer_type: timer_type || undefined,
        }),
      });

      if (res.ok) {
        const challenge = await res.json();
        set_created_id(challenge.id);
        if (challenge.join_code) {
          set_join_code(challenge.join_code);
        }

        // Generate invite link (for head-to-head / non-group)
        if (format !== "group") {
          const invite_res = await fetch(
            `/api/challenges/${challenge.id}/invite`,
            { method: "POST" }
          );
          if (invite_res.ok) {
            const invite = await invite_res.json();
            set_invite_url(invite.invite_url);
          }
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
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-surface pt-14 md:pt-20">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-surface pt-14 md:pt-20">
      <div className="w-full max-w-lg mx-auto p-6 lg:p-8">
        <button
          onClick={() => router.push("/challenges")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6 bg-transparent border-none cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Challenges
        </button>

        {!created_id ? (
          <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)]">
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

              <div className="relative" ref={game_dropdown_ref}>
                <label className="text-sm font-medium mb-2 block">
                  Game
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={game_search}
                    onChange={(e) => {
                      set_game_search(e.target.value);
                      set_show_game_dropdown(true);
                      if (!e.target.value.trim()) set_selected_game_id(null);
                    }}
                    onFocus={() => set_show_game_dropdown(true)}
                    placeholder="Search or add a game..."
                    className="w-full p-3 pr-10 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
                </div>
                {show_game_dropdown && (
                  <div className="absolute z-50 w-full mt-1 bg-card border rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {games
                      .filter((g) =>
                        g.name.toLowerCase().includes(game_search.toLowerCase())
                      )
                      .map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          className={`w-full text-left px-3 py-2 text-sm hover:bg-muted cursor-pointer border-none bg-transparent ${
                            selected_game_id === g.id ? "bg-muted font-medium" : ""
                          }`}
                          onClick={() => {
                            set_selected_game_id(g.id);
                            set_game_search(g.name);
                            set_show_game_dropdown(false);
                          }}
                        >
                          {g.name}
                        </button>
                      ))}
                    {game_search.trim() &&
                      !games.some(
                        (g) => g.name.toLowerCase() === game_search.trim().toLowerCase()
                      ) && (
                        <button
                          type="button"
                          className="w-full text-left px-3 py-2 text-sm hover:bg-muted cursor-pointer border-none bg-transparent flex items-center gap-2 text-primary"
                          disabled={adding_game}
                          onClick={async () => {
                            set_adding_game(true);
                            try {
                              const res = await fetch("/api/games", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ name: game_search.trim() }),
                              });
                              if (res.ok) {
                                const game = await res.json();
                                set_games((prev) =>
                                  [...prev, game].sort((a, b) =>
                                    a.name.localeCompare(b.name)
                                  )
                                );
                                set_selected_game_id(game.id);
                                set_game_search(game.name);
                                set_show_game_dropdown(false);
                              }
                            } finally {
                              set_adding_game(false);
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                          {adding_game ? "Adding..." : `Add "${game_search.trim()}"`}
                        </button>
                      )}
                    {!game_search.trim() && games.length === 0 && (
                      <div className="px-3 py-2 text-sm text-muted-foreground">
                        Type a game name to add it
                      </div>
                    )}
                  </div>
                )}
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

              <div>
                <label className="text-sm font-medium mb-2 block">
                  Theme GIF (optional)
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
                <label className="text-sm font-medium mb-2 block">Format</label>
                <div className="flex gap-2">
                  {VALID_FORMATS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => set_format(f)}
                      className={`flex-1 py-2 px-3 rounded-lg text-sm border cursor-pointer capitalize transition-colors ${
                        format === f
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted border-input"
                      }`}
                    >
                      {f === "head-to-head" ? "1v1" : f.charAt(0).toUpperCase() + f.slice(1)}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {format === "head-to-head" && "Challenge a specific opponent"}
                  {format === "group" && "Multiple players join with a code"}
                  {format === "solo" && "Track your personal progress"}
                </p>
              </div>

              {timer_type && (
                <div className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-lg">
                  Timer type: <span className="font-medium capitalize">{timer_type.replace(/-/g, " ")}</span>
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={is_public}
                  onChange={(e) => set_is_public(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <span className="text-sm font-medium">Make this challenge public</span>
              </label>

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
          <div className="bg-card rounded-[1rem] p-6 shadow-[var(--shadow-soft)] text-center">
            <div className="text-4xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold mb-2">Challenge Created!</h2>

            {join_code ? (
              <>
                <p className="text-muted-foreground mb-4">
                  Share this join code so others can join your group challenge:
                </p>
                <div className="bg-muted rounded-lg p-4 mb-4">
                  <div className="text-3xl font-mono font-bold tracking-widest text-foreground">
                    {join_code}
                  </div>
                </div>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(join_code);
                    set_copied(true);
                    setTimeout(() => set_copied(false), 2000);
                  }}
                  variant="outline"
                  className="w-full mb-4"
                >
                  {copied ? "Copied!" : "Copy Join Code"}
                </Button>
              </>
            ) : (
              <>
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
              </>
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
      <Footer />
    </>
  );
}

export default function CreateChallengePage() {
  return (
    <Suspense fallback={
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center bg-surface pt-14 md:pt-20">
          <p className="text-muted-foreground">Loading...</p>
        </main>
      </>
    }>
      <CreateChallengeForm />
    </Suspense>
  );
}
