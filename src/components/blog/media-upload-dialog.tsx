"use client";

import { useEffect, useRef, useState } from "react";

type MediaUploadDialogProps = {
  open: boolean;
  initial_file?: File | null;
  on_close: () => void;
  on_uploaded: (result: { path: string; filename: string }) => void;
};

function default_name_from(file: File): string {
  const base = file.name.replace(/\.(png|jpe?g|webp)$/i, "");
  return base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function format_size(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaUploadDialog({
  open,
  initial_file,
  on_close,
  on_uploaded,
}: MediaUploadDialogProps) {
  const file_input_ref = useRef<HTMLInputElement>(null);
  const [file, set_file] = useState<File | null>(null);
  const [preview_url, set_preview_url] = useState<string>("");
  const [name, set_name] = useState("");
  const [uploading, set_uploading] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    if (!open) {
      set_file(null);
      set_preview_url("");
      set_name("");
      set_error("");
      set_uploading(false);
      return;
    }
    if (initial_file) {
      set_file(initial_file);
      set_name(default_name_from(initial_file));
    }
  }, [open, initial_file]);

  useEffect(() => {
    if (!file) {
      set_preview_url("");
      return;
    }
    const url = URL.createObjectURL(file);
    set_preview_url(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  if (!open) return null;

  function pick_file() {
    file_input_ref.current?.click();
  }

  function handle_file_change(e: React.ChangeEvent<HTMLInputElement>) {
    const chosen = e.target.files?.[0];
    if (!chosen) return;
    set_file(chosen);
    set_name(default_name_from(chosen));
    set_error("");
  }

  async function submit() {
    if (!file) {
      set_error("Pick a file first.");
      return;
    }
    const trimmed = name.trim();
    if (!trimmed || !/[a-z0-9]/i.test(trimmed)) {
      set_error("Name must contain at least one letter or digit.");
      return;
    }

    set_uploading(true);
    set_error("");
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("name", trimmed);
      const res = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: form,
      });
      const data = (await res.json()) as {
        path?: string;
        filename?: string;
        error?: string;
      };
      if (!res.ok || !data.path || !data.filename) {
        set_error(data.error ?? "Upload failed.");
        return;
      }
      on_uploaded({ path: data.path, filename: data.filename });
      on_close();
    } catch {
      set_error("Network error.");
    } finally {
      set_uploading(false);
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
        className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 space-y-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-headline font-black text-foreground">Upload image</h2>

        {!file && (
          <button
            type="button"
            onClick={pick_file}
            className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 text-sm text-gray-500 hover:border-gray-400 hover:bg-gray-50 transition-colors"
          >
            Click to choose an image (PNG, JPEG, WebP — max 5MB)
          </button>
        )}

        {file && preview_url && (
          <div className="space-y-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview_url}
              alt="Preview"
              className="w-full max-h-64 object-contain rounded border border-gray-200 bg-gray-50"
            />
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>
                {file.name} · {format_size(file.size)}
              </span>
              <button
                type="button"
                onClick={pick_file}
                className="text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer"
              >
                Change file
              </button>
            </div>
          </div>
        )}

        <input
          ref={file_input_ref}
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handle_file_change}
          className="hidden"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Filename</label>
          <input
            type="text"
            value={name}
            onChange={(e) => set_name(e.target.value)}
            placeholder="pomodoro-hero"
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
          <p className="text-xs text-gray-500 mt-1">
            Saved as <span className="font-mono">{name || "name"}.{file ? file.type.split("/")[1].replace("jpeg", "jpg") : "ext"}</span>
            {" — "}if that filename already exists it will be suffixed automatically (e.g. <span className="font-mono">{(name || "name") + "-2"}</span>).
          </p>
        </div>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded p-2">{error}</p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t">
          <button
            type="button"
            onClick={on_close}
            disabled={uploading}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            disabled={uploading || !file}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {uploading ? "Uploading…" : "Upload"}
          </button>
        </div>
      </div>
    </div>
  );
}
