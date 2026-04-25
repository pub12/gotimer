"use client";

import { useCallback, useEffect, useState } from "react";
import { MediaUploadDialog } from "./media-upload-dialog";

type UsageEntry = {
  post_id: string;
  post_title: string;
  post_slug: string;
};

type MediaImage = {
  filename: string;
  path: string;
  size: number;
  uploaded_at: string;
  used_in: UsageEntry[];
};

type MediaPickerDialogProps = {
  open: boolean;
  on_close: () => void;
  on_pick: (result: { path: string; filename: string }) => void;
};

function format_size(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export function MediaPickerDialog({ open, on_close, on_pick }: MediaPickerDialogProps) {
  const [images, set_images] = useState<MediaImage[]>([]);
  const [loading, set_loading] = useState(false);
  const [error, set_error] = useState("");
  const [selected_filename, set_selected_filename] = useState<string | null>(null);
  const [upload_open, set_upload_open] = useState(false);

  const reload = useCallback(async (select_filename?: string) => {
    set_loading(true);
    set_error("");
    try {
      const res = await fetch("/api/admin/blog-images");
      const data = (await res.json()) as { images?: MediaImage[]; error?: string };
      if (!res.ok) {
        set_error(data.error ?? "Failed to load images.");
        set_images([]);
        return;
      }
      const list = data.images ?? [];
      set_images(list);
      if (select_filename && list.some((i) => i.filename === select_filename)) {
        set_selected_filename(select_filename);
      }
    } catch {
      set_error("Network error.");
      set_images([]);
    } finally {
      set_loading(false);
    }
  }, []);

  useEffect(() => {
    if (!open) {
      set_selected_filename(null);
      set_upload_open(false);
      return;
    }
    reload();
  }, [open, reload]);

  const selected = images.find((i) => i.filename === selected_filename) ?? null;

  const insert = useCallback(() => {
    if (!selected) return;
    on_pick({ path: selected.path, filename: selected.filename });
    on_close();
  }, [selected, on_pick, on_close]);

  useEffect(() => {
    if (!open) return;
    function handle_key(e: KeyboardEvent) {
      if (e.key === "Escape") {
        e.preventDefault();
        on_close();
      } else if (e.key === "Enter" && selected) {
        e.preventDefault();
        insert();
      }
    }
    window.addEventListener("keydown", handle_key);
    return () => window.removeEventListener("keydown", handle_key);
  }, [open, selected, insert, on_close]);

  if (!open) return null;

  const is_empty = !loading && images.length === 0 && !error;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        onClick={on_close}
      >
        <div
          className="bg-white rounded-lg shadow-xl w-full max-w-5xl h-[80vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-5 border-b">
            <div>
              <h2 className="text-lg font-headline font-black text-foreground">Pick image from library</h2>
              <p className="text-xs text-gray-500 mt-1">
                {loading ? "Loading…" : `${images.length} image${images.length === 1 ? "" : "s"}`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => set_upload_open(true)}
              className="px-3 py-1.5 text-xs bg-surface-container border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Upload new
            </button>
          </div>

          {error && (
            <div className="m-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded">
              {error}
            </div>
          )}

          {is_empty ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 gap-3">
              <p className="text-muted-foreground">No images in your library yet.</p>
              <button
                type="button"
                onClick={() => set_upload_open(true)}
                className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
              >
                Upload new
              </button>
            </div>
          ) : (
            <div className="flex-1 flex min-h-0">
              {/* Left: thumbnails (70%) */}
              <div className="w-[70%] border-r overflow-auto p-4">
                {loading && images.length === 0 ? (
                  <p className="text-muted-foreground text-sm">Loading…</p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    {images.map((img) => {
                      const is_selected = img.filename === selected_filename;
                      return (
                        <button
                          key={img.filename}
                          type="button"
                          onClick={() => set_selected_filename(img.filename)}
                          onDoubleClick={() => {
                            set_selected_filename(img.filename);
                            on_pick({ path: img.path, filename: img.filename });
                            on_close();
                          }}
                          className={[
                            "group flex flex-col bg-white border rounded-md overflow-hidden text-left transition-all",
                            is_selected
                              ? "ring-2 ring-primary border-primary"
                              : "border-gray-200 hover:border-gray-400",
                          ].join(" ")}
                        >
                          <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={img.path}
                              alt={img.filename}
                              className="max-w-full max-h-full object-contain"
                              loading="lazy"
                            />
                          </div>
                          <div className="px-2 py-1.5 border-t border-gray-100">
                            <p className="font-mono text-[11px] text-foreground break-all line-clamp-2">
                              {img.filename}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right: preview (30%) */}
              <div className="w-[30%] p-4 flex flex-col min-h-0">
                {selected ? (
                  <>
                    <div className="flex-1 flex items-center justify-center bg-gray-50 rounded border border-gray-200 overflow-hidden min-h-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={selected.path}
                        alt={selected.filename}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="mt-3 space-y-1.5 text-xs">
                      <p className="font-mono text-foreground break-all">{selected.filename}</p>
                      <p className="text-muted-foreground">
                        {format_size(selected.size)} ·{" "}
                        {new Date(selected.uploaded_at).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                      <span
                        className={`inline-block text-xs px-2 py-0.5 rounded-full ${
                          selected.used_in.length > 0
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {selected.used_in.length > 0
                          ? `Used in ${selected.used_in.length} post${selected.used_in.length === 1 ? "" : "s"}`
                          : "Unused"}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-sm text-muted-foreground text-center px-4">
                    Click a thumbnail on the left to preview it here.
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 p-4 border-t">
            <button
              type="button"
              onClick={on_close}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-transparent border-none cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={insert}
              disabled={!selected}
              className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              OK
            </button>
          </div>
        </div>
      </div>

      <MediaUploadDialog
        open={upload_open}
        on_close={() => set_upload_open(false)}
        on_uploaded={(result) => {
          reload(result.filename);
        }}
      />
    </>
  );
}
