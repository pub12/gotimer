"use client";

import { useEffect, useState } from "react";

type MediaRenameDialogProps = {
  open: boolean;
  filename: string;
  on_close: () => void;
  on_renamed: (result: { path: string; filename: string; posts_updated: number }) => void;
};

function strip_ext(filename: string): string {
  return filename.replace(/\.(png|jpe?g|webp)$/i, "");
}

export function MediaRenameDialog({
  open,
  filename,
  on_close,
  on_renamed,
}: MediaRenameDialogProps) {
  const [new_name, set_new_name] = useState("");
  const [saving, set_saving] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    if (open) {
      set_new_name(strip_ext(filename));
      set_error("");
      set_saving(false);
    }
  }, [open, filename]);

  if (!open) return null;

  async function submit() {
    const trimmed = new_name.trim();
    if (!trimmed || !/[a-z0-9]/i.test(trimmed)) {
      set_error("Name must contain at least one letter or digit.");
      return;
    }

    set_saving(true);
    set_error("");
    try {
      const res = await fetch(
        `/api/admin/blog-images/${encodeURIComponent(filename)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ new_name: trimmed }),
        }
      );
      const data = (await res.json()) as {
        path?: string;
        filename?: string;
        posts_updated?: number;
        error?: string;
      };
      if (!res.ok || !data.path || !data.filename) {
        set_error(data.error ?? "Rename failed.");
        return;
      }
      on_renamed({
        path: data.path,
        filename: data.filename,
        posts_updated: data.posts_updated ?? 0,
      });
      on_close();
    } catch {
      set_error("Network error.");
    } finally {
      set_saving(false);
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={on_close}
    >
      <div
        className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <h2 className="text-lg font-headline font-black text-foreground">Rename image</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">{filename}</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New name</label>
          <input
            type="text"
            value={new_name}
            onChange={(e) => set_new_name(e.target.value)}
            autoFocus
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Every post that references this image will be rewritten automatically. The file extension is kept.
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={on_close}
            disabled={saving}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={saving}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {saving ? "Renaming…" : "Rename"}
          </button>
        </div>
      </div>
    </div>
  );
}
