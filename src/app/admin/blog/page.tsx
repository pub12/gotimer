"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { use_hazo_auth } from "hazo_auth/client";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  publish_date: string | null;
  category_name: string | null;
}

interface ApiPost {
  id: string;
  title: string;
  slug: string;
  status: string;
  publish_date: string | null;
  category_id: string | null;
}

const STATUS_STYLES: Record<string, string> = {
  published: "bg-green-100 text-green-700",
  draft: "bg-surface-container text-muted-foreground",
  scheduled: "bg-blue-100 text-blue-700",
};

export default function AdminBlogPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [posts, set_posts] = useState<BlogPost[]>([]);
  const [loading, set_loading] = useState(true);
  const [deleting, set_deleting] = useState<string | null>(null);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) {
      router.push("/");
    }
  }, [auth_loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok) return;

    fetch("/api/admin/blog")
      .then((res) => res.json())
      .then((data: { posts: ApiPost[] }) => {
        set_posts(
          data.posts.map((p) => ({
            id: p.id,
            title: p.title,
            slug: p.slug,
            status: p.status,
            publish_date: p.publish_date,
            category_name: null, // categories fetched from separate endpoint if needed
          }))
        );
      })
      .catch(() => {})
      .finally(() => set_loading(false));
  }, [auth_loading, authenticated, permission_ok]);

  async function handle_delete(id: string, title: string) {
    if (!confirm(`Delete "${title}"? This cannot be undone.`)) return;
    set_deleting(id);
    try {
      const res = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
      if (res.ok) {
        set_posts((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Failed to delete post.");
      }
    } catch {
      alert("Failed to delete post.");
    } finally {
      set_deleting(null);
    }
  }

  if (auth_loading || loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-headline font-black text-foreground">Blog Posts</h1>
        <Link
          href="/admin/blog/new"
          className="px-4 py-2 bg-primary text-primary-foreground text-sm rounded-md hover:bg-primary/90 transition-colors"
        >
          New Post
        </Link>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted-foreground">No blog posts yet.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-surface-container-low border-b border-surface-container">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-foreground">Title</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Status</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Publish Date</th>
                <th className="text-left px-4 py-3 font-medium text-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-surface-container-low">
                  <td className="px-4 py-3 font-medium text-foreground max-w-xs truncate">
                    {post.title}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">{post.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full capitalize ${
                        STATUS_STYLES[post.status] ?? "bg-surface-container text-muted-foreground"
                      }`}
                    >
                      {post.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {post.publish_date
                      ? new Date(post.publish_date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })
                      : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handle_delete(post.id, post.title)}
                        disabled={deleting === post.id}
                        className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50"
                      >
                        {deleting === post.id ? "Deleting…" : "Delete"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
