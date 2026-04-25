"use client";

import { useEffect, useState } from "react";

type UsageEntry = {
  post_id: string;
  post_title: string;
  post_slug: string;
};

type MediaDeleteDialogProps = {
  open: boolean;
  filename: string;
  used_in: UsageEntry[];
  on_close: () => void;
  on_deleted: () => void;
};

export function MediaDeleteDialog({
  open,
  filename,
  used_in,
  on_close,
  on_deleted,
}: MediaDeleteDialogProps) {
  const [confirmed, set_confirmed] = useState(false);
  const [deleting, set_deleting] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    if (open) {
      set_confirmed(false);
      set_deleting(false);
      set_error("");
    }
  }, [open]);

  if (!open) return null;

  const in_use = used_in.length > 0;

  async function submit() {
    if (in_use && !confirmed) {
      set_error("Tick the box to confirm you understand the consequences.");
      return;
    }
    set_deleting(true);
    set_error("");
    try {
      const url = `/api/admin/blog-images/${encodeURIComponent(filename)}${
        in_use ? "?confirm=true" : ""
      }`;
      const res = await fetch(url, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        set_error((data as { error?: string }).error ?? "Delete failed.");
        return;
      }
      on_deleted();
      on_close();
    } catch {
      set_error("Network error.");
    } finally {
      set_deleting(false);
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
          <h2 className="text-lg font-headline font-black text-foreground">Delete image</h2>
          <p className="text-xs text-gray-500 mt-1 font-mono">{filename}</p>
        </div>

        {in_use ? (
          <div className="space-y-3">
            <p className="text-sm text-red-700 bg-red-50 border border-red-200 rounded p-3">
              This image is embedded in {used_in.length} post
              {used_in.length === 1 ? "" : "s"}. Deleting will leave a broken reference — post
              content is NOT modified.
            </p>
            <ul className="text-sm list-disc pl-5 space-y-1 max-h-40 overflow-auto">
              {used_in.map((u) => (
                <li key={u.post_id}>
                  <span className="font-medium">{u.post_title}</span>{" "}
                  <span className="text-gray-500 font-mono text-xs">/blog/{u.post_slug}</span>
                </li>
              ))}
            </ul>
            <label className="flex items-start gap-2 text-sm">
              <input
                type="checkbox"
                checked={confirmed}
                onChange={(e) => set_confirmed(e.target.checked)}
                className="mt-0.5"
              />
              <span>I understand the referencing posts will display a broken image.</span>
            </label>
          </div>
        ) : (
          <p className="text-sm text-gray-700">
            This file is not referenced in any post. Deleting is safe.
          </p>
        )}

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={on_close}
            disabled={deleting}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={deleting || (in_use && !confirmed)}
            className="px-4 py-2 bg-red-600 text-white text-sm rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {deleting ? "Deleting…" : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
