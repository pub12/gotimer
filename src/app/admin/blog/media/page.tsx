"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { MediaUploadDialog } from "@/components/blog/media-upload-dialog";
import { MediaRenameDialog } from "@/components/blog/media-rename-dialog";
import { MediaDeleteDialog } from "@/components/blog/media-delete-dialog";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

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

type FilterMode = "all" | "used" | "unused";

function format_size(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
}

export default function AdminBlogMediaPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [images, set_images] = useState<MediaImage[]>([]);
  const [loading, set_loading] = useState(true);
  const [filter, set_filter] = useState<FilterMode>("all");
  const [expanded, set_expanded] = useState<Set<string>>(new Set());
  const [toast, set_toast] = useState("");

  const [upload_open, set_upload_open] = useState(false);
  const [rename_target, set_rename_target] = useState<MediaImage | null>(null);
  const [delete_target, set_delete_target] = useState<MediaImage | null>(null);
  const [bulk_deleting, set_bulk_deleting] = useState(false);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) router.push("/");
  }, [auth_loading, authenticated, permission_ok, router]);

  const reload = useCallback(async () => {
    set_loading(true);
    try {
      const res = await fetch("/api/admin/blog-images");
      const data = (await res.json()) as { images?: MediaImage[] };
      set_images(data.images ?? []);
    } catch {
      set_images([]);
    } finally {
      set_loading(false);
    }
  }, []);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok) return;
    reload();
  }, [auth_loading, authenticated, permission_ok, reload]);

  const filtered = useMemo(() => {
    if (filter === "used") return images.filter((i) => i.used_in.length > 0);
    if (filter === "unused") return images.filter((i) => i.used_in.length === 0);
    return images;
  }, [images, filter]);

  const unused_count = useMemo(
    () => images.filter((i) => i.used_in.length === 0).length,
    [images]
  );

  function toggle_expanded(filename: string) {
    set_expanded((prev) => {
      const next = new Set(prev);
      if (next.has(filename)) next.delete(filename);
      else next.add(filename);
      return next;
    });
  }

  function show_toast(message: string) {
    set_toast(message);
    setTimeout(() => set_toast(""), 3500);
  }

  async function bulk_delete_unused() {
    if (!confirm(`Delete ${unused_count} unused image${unused_count === 1 ? "" : "s"}? This cannot be undone.`)) return;
    set_bulk_deleting(true);
    try {
      const res = await fetch("/api/admin/blog-images?unused=true", { method: "DELETE" });
      const data = (await res.json()) as { deleted?: number; error?: string };
      if (!res.ok) {
        show_toast(data.error ?? "Bulk delete failed.");
        return;
      }
      show_toast(`Deleted ${data.deleted ?? 0} unused image${data.deleted === 1 ? "" : "s"}.`);
      await reload();
    } catch {
      show_toast("Network error.");
    } finally {
      set_bulk_deleting(false);
    }
  }

  if (auth_loading || loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading…</p>
      </main>
    );
  }
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-headline font-black text-foreground">Blog Media</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {images.length} image{images.length === 1 ? "" : "s"} · {unused_count} unused
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filter}
            onChange={(e) => set_filter(e.target.value as FilterMode)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <option value="all">All ({images.length})</option>
            <option value="used">Used ({images.length - unused_count})</option>
            <option value="unused">Unused ({unused_count})</option>
          </select>
          <button
            type="button"
            onClick={bulk_delete_unused}
            disabled={unused_count === 0 || bulk_deleting}
            className="px-4 py-2 border border-red-300 text-red-700 text-sm rounded-md hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {bulk_deleting ? "Deleting…" : `Delete ${unused_count} unused`}
          </button>
          <button
            type="button"
            onClick={() => set_upload_open(true)}
            className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
          >
            Upload
          </button>
        </div>
      </div>

      {toast && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-800 text-sm rounded">
          {toast}
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="text-muted-foreground">No images to show.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((img) => {
            const in_use = img.used_in.length > 0;
            const is_open = expanded.has(img.filename);
            return (
              <div
                key={img.filename}
                className="border border-gray-200 rounded-lg overflow-hidden bg-white flex flex-col"
              >
                <div className="aspect-video bg-gray-50 flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img.path}
                    alt={img.filename}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
                <div className="p-3 space-y-2 flex-1 flex flex-col">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-mono text-xs text-foreground break-all flex-1">
                      {img.filename}
                    </p>
                    <span
                      className={`shrink-0 text-xs px-2 py-0.5 rounded-full ${
                        in_use
                          ? "bg-blue-100 text-blue-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {in_use ? `Used ×${img.used_in.length}` : "Unused"}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {format_size(img.size)} ·{" "}
                    {new Date(img.uploaded_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                  {in_use && (
                    <div>
                      <button
                        type="button"
                        onClick={() => toggle_expanded(img.filename)}
                        className="text-xs text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer p-0"
                      >
                        {is_open ? "Hide usage" : "Show usage"}
                      </button>
                      {is_open && (
                        <ul className="mt-2 text-xs space-y-1 list-disc pl-4">
                          {img.used_in.map((u) => (
                            <li key={u.post_id}>
                              <Link
                                href={`/admin/blog/${u.post_id}`}
                                className="text-blue-600 hover:text-blue-800"
                              >
                                {u.post_title}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-2 border-t mt-auto">
                    <button
                      type="button"
                      onClick={() => set_rename_target(img)}
                      className="text-xs text-blue-600 hover:text-blue-800 bg-transparent border-none cursor-pointer"
                    >
                      Rename
                    </button>
                    <button
                      type="button"
                      onClick={() => set_delete_target(img)}
                      className="text-xs text-red-600 hover:text-red-800 bg-transparent border-none cursor-pointer"
                    >
                      Delete
                    </button>
                    <a
                      href={img.path}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-gray-500 hover:text-gray-700 ml-auto"
                    >
                      Open
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <MediaUploadDialog
        open={upload_open}
        on_close={() => set_upload_open(false)}
        on_uploaded={(result) => {
          show_toast(`Uploaded ${result.filename}.`);
          reload();
        }}
      />

      {rename_target && (
        <MediaRenameDialog
          open={!!rename_target}
          filename={rename_target.filename}
          on_close={() => set_rename_target(null)}
          on_renamed={(result) => {
            show_toast(
              result.posts_updated > 0
                ? `Renamed to ${result.filename} and updated ${result.posts_updated} post${
                    result.posts_updated === 1 ? "" : "s"
                  }.`
                : `Renamed to ${result.filename}.`
            );
            reload();
          }}
        />
      )}

      {delete_target && (
        <MediaDeleteDialog
          open={!!delete_target}
          filename={delete_target.filename}
          used_in={delete_target.used_in}
          on_close={() => set_delete_target(null)}
          on_deleted={() => {
            show_toast(`Deleted ${delete_target.filename}.`);
            reload();
          }}
        />
      )}
    </main>
  );
}
