"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { use_hazo_auth } from "hazo_auth/client";
import { Plus, Trash2, Image as ImageIcon } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type Character = {
  id: string;
  file_path: string;
  character_name: string;
  scene_description: string;
  generation_prompt: string;
  created_at: string;
};

function CharacterCard({
  character,
  on_delete,
}: {
  character: Character;
  on_delete: (id: string, name: string) => void;
}) {
  const [img_error, set_img_error] = useState(false);

  return (
    <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-hidden group">
      <div className="relative aspect-square bg-surface-container flex items-center justify-center">
        {!img_error ? (
          <Image
            src={character.file_path}
            alt={character.character_name}
            fill
            className="object-cover"
            onError={() => set_img_error(true)}
          />
        ) : (
          <ImageIcon className="w-12 h-12 text-muted-foreground" />
        )}
        <button
          onClick={() => on_delete(character.id, character.character_name)}
          className="absolute top-2 right-2 p-1.5 rounded-lg bg-white/90 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive/10 border-none cursor-pointer"
          aria-label="Delete character"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3">
        <p className="text-sm font-semibold text-foreground truncate">{character.character_name}</p>
        {character.scene_description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">{character.scene_description}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">
          {new Date(character.created_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

export default function AdminCharactersPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [characters, set_characters] = useState<Character[]>([]);
  const [chars_loading, set_chars_loading] = useState(true);
  const [show_form, set_show_form] = useState(false);
  const [saving, set_saving] = useState(false);
  const [form, set_form] = useState({
    character_name: "",
    file_path: "",
    scene_description: "",
    generation_prompt: "",
  });
  const [form_error, set_form_error] = useState("");

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  const fetch_characters = useCallback(() => {
    if (loading || !authenticated || !permission_ok) return;
    set_chars_loading(true);
    fetch("/api/admin/characters")
      .then((r) => r.json())
      .then((data) => set_characters(Array.isArray(data.characters) ? data.characters : []))
      .catch(() => {})
      .finally(() => set_chars_loading(false));
  }, [loading, authenticated, permission_ok]);

  useEffect(() => {
    fetch_characters();
  }, [fetch_characters]);

  async function handle_add() {
    if (!form.character_name.trim() || !form.file_path.trim()) {
      set_form_error("Character name and file path are required.");
      return;
    }
    set_form_error("");
    set_saving(true);
    try {
      const res = await fetch("/api/admin/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Failed to save");
      set_form({ character_name: "", file_path: "", scene_description: "", generation_prompt: "" });
      set_show_form(false);
      fetch_characters();
    } catch {
      set_form_error("Failed to save character.");
    } finally {
      set_saving(false);
    }
  }

  async function handle_delete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
    await fetch(`/api/admin/characters?id=${id}`, { method: "DELETE" });
    set_characters((prev) => prev.filter((c) => c.id !== id));
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-headline font-black text-foreground">Character Library</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage character images used in timer pages and blog posts.</p>
        </div>
        <button
          onClick={() => set_show_form((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-[0.75rem] text-sm font-medium hover:bg-secondary/90 transition-colors border-none cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          Add Character
        </button>
      </div>

      {show_form && (
        <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] p-5 mb-6">
          <h2 className="text-base font-semibold text-foreground mb-4">New Character</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Character Name *</label>
              <input
                type="text"
                value={form.character_name}
                onChange={(e) => set_form((f) => ({ ...f, character_name: e.target.value }))}
                placeholder="e.g. Timer Bot"
                className="w-full border border-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">File Path / URL *</label>
              <input
                type="text"
                value={form.file_path}
                onChange={(e) => set_form((f) => ({ ...f, file_path: e.target.value }))}
                placeholder="/images/characters/bot.png"
                className="w-full border border-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Scene Description</label>
              <input
                type="text"
                value={form.scene_description}
                onChange={(e) => set_form((f) => ({ ...f, scene_description: e.target.value }))}
                placeholder="e.g. Friendly robot holding a stopwatch"
                className="w-full border border-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-muted-foreground mb-1">Generation Prompt</label>
              <input
                type="text"
                value={form.generation_prompt}
                onChange={(e) => set_form((f) => ({ ...f, generation_prompt: e.target.value }))}
                placeholder="Runware prompt (optional)"
                className="w-full border border-surface-container rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30"
              />
            </div>
          </div>
          {form_error && <p className="text-red-500 text-sm mt-3">{form_error}</p>}
          <div className="flex gap-3 mt-4">
            <button
              onClick={handle_add}
              disabled={saving}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-[0.75rem] text-sm font-medium hover:bg-secondary/90 disabled:opacity-50 border-none cursor-pointer"
            >
              {saving ? "Saving..." : "Save Character"}
            </button>
            <button
              onClick={() => { set_show_form(false); set_form_error(""); }}
              className="px-4 py-2 bg-surface-container text-foreground rounded-lg text-sm font-medium hover:bg-surface-container-low border-none cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {chars_loading ? (
        <p className="text-muted-foreground text-sm">Loading characters...</p>
      ) : characters.length === 0 ? (
        <div className="bg-surface-container-low border border-dashed border-surface-container rounded-[1rem] p-10 text-center">
          <ImageIcon className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground text-sm">No characters yet. Add one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {characters.map((c) => (
            <CharacterCard key={c.id} character={c} on_delete={handle_delete} />
          ))}
        </div>
      )}
    </main>
  );
}
