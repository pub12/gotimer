"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

interface Category {
  id: string;
  name: string;
  slug: string;
  colour: string | null;
  description: string | null;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export default function AdminBlogCategoriesPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [categories, set_categories] = useState<Category[]>([]);
  const [loading, set_loading] = useState(true);
  const [deleting, set_deleting] = useState<string | null>(null);
  const [saving, set_saving] = useState(false);
  const [error, set_error] = useState("");

  // Create form state
  const [new_name, set_new_name] = useState("");
  const [new_slug, set_new_slug] = useState("");
  const [new_colour, set_new_colour] = useState("#6366f1");
  const [new_description, set_new_description] = useState("");
  const [slug_edited, set_slug_edited] = useState(false);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) router.push("/");
  }, [auth_loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok) return;
    load_categories();
  }, [auth_loading, authenticated, permission_ok]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!slug_edited && new_name) {
      set_new_slug(slugify(new_name));
    }
  }, [new_name, slug_edited]);

  function load_categories() {
    fetch("/api/admin/blog/categories")
      .then((r) => r.json())
      .then((data: { categories: Category[] }) => set_categories(data.categories ?? []))
      .catch(() => {})
      .finally(() => set_loading(false));
  }

  async function handle_create(e: React.FormEvent) {
    e.preventDefault();
    if (!new_name.trim() || !new_slug.trim()) {
      set_error("Name and slug are required.");
      return;
    }
    set_saving(true);
    set_error("");
    try {
      const res = await fetch("/api/admin/blog/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: new_name.trim(),
          slug: new_slug.trim(),
          colour: new_colour || null,
          description: new_description.trim() || null,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        set_error((data as { error?: string }).error ?? "Failed to create category.");
        return;
      }
      set_new_name("");
      set_new_slug("");
      set_new_colour("#6366f1");
      set_new_description("");
      set_slug_edited(false);
      load_categories();
    } catch {
      set_error("Network error.");
    } finally {
      set_saving(false);
    }
  }

  async function handle_delete(id: string, name: string) {
    if (!confirm(`Delete category "${name}"?`)) return;
    set_deleting(id);
    try {
      const res = await fetch(`/api/admin/blog/categories/${id}`, { method: "DELETE" });
      if (res.ok) {
        set_categories((prev) => prev.filter((c) => c.id !== id));
      } else {
        alert("Failed to delete category.");
      }
    } catch {
      alert("Failed to delete category.");
    } finally {
      set_deleting(null);
    }
  }

  if (auth_loading || loading) {
    return <main className="p-8"><p className="text-gray-500">Loading...</p></main>;
  }

  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Blog Categories</h1>

      {/* Create form */}
      <section className="border rounded-lg p-5 mb-8 bg-gray-50">
        <h2 className="text-sm font-semibold text-gray-700 mb-4">New Category</h2>
        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
            {error}
          </div>
        )}
        <form onSubmit={handle_create} className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
            <input
              type="text"
              value={new_name}
              onChange={(e) => set_new_name(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Category name"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
            <input
              type="text"
              value={new_slug}
              onChange={(e) => {
                set_slug_edited(true);
                set_new_slug(e.target.value);
              }}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="category-slug"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Colour</label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={new_colour}
                onChange={(e) => set_new_colour(e.target.value)}
                className="w-9 h-9 border border-gray-300 rounded cursor-pointer"
              />
              <span className="text-xs text-gray-500 font-mono">{new_colour}</span>
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              type="text"
              value={new_description}
              onChange={(e) => set_new_description(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              placeholder="Optional description"
            />
          </div>
          <div className="col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {saving ? "Creating…" : "Create Category"}
            </button>
          </div>
        </form>
      </section>

      {/* Categories table */}
      {categories.length === 0 ? (
        <p className="text-gray-500">No categories yet.</p>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Slug</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Colour</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {categories.map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{cat.name}</td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{cat.slug}</td>
                  <td className="px-4 py-3">
                    {cat.colour ? (
                      <div className="flex items-center gap-2">
                        <span
                          className="w-4 h-4 rounded-full border border-gray-200 inline-block"
                          style={{ backgroundColor: cat.colour }}
                        />
                        <span className="text-xs text-gray-500 font-mono">{cat.colour}</span>
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs">—</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => handle_delete(cat.id, cat.name)}
                      disabled={deleting === cat.id}
                      className="text-red-500 hover:text-red-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      {deleting === cat.id ? "Deleting…" : "Delete"}
                    </button>
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
