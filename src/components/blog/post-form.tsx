"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface FaqItem {
  question: string;
  answer: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface PostFormData {
  title: string;
  slug: string;
  content: string;
  category_id: string;
  meta_title: string;
  meta_description: string;
  faq_items: FaqItem[];
  publish_date: string;
}

interface PostFormProps {
  initial?: Partial<PostFormData>;
  post_id?: string; // if editing
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function PostForm({ initial, post_id }: PostFormProps) {
  const router = useRouter();
  const [categories, set_categories] = useState<Category[]>([]);

  const [title, set_title] = useState(initial?.title ?? "");
  const [slug, set_slug] = useState(initial?.slug ?? "");
  const [content, set_content] = useState(initial?.content ?? "");
  const [category_id, set_category_id] = useState(initial?.category_id ?? "");
  const [meta_title, set_meta_title] = useState(initial?.meta_title ?? "");
  const [meta_description, set_meta_description] = useState(initial?.meta_description ?? "");
  const [faq_items, set_faq_items] = useState<FaqItem[]>(initial?.faq_items ?? []);
  const [publish_date, set_publish_date] = useState(initial?.publish_date ?? "");
  const [slug_edited, set_slug_edited] = useState(!!initial?.slug);
  const [saving, set_saving] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    fetch("/api/admin/blog/categories")
      .then((r) => r.json())
      .then((data: { categories: Category[] }) => set_categories(data.categories ?? []))
      .catch(() => {});
  }, []);

  // Auto-generate slug from title (unless user has manually edited it)
  useEffect(() => {
    if (!slug_edited && title) {
      set_slug(slugify(title));
    }
  }, [title, slug_edited]);

  function add_faq() {
    set_faq_items((prev) => [...prev, { question: "", answer: "" }]);
  }

  function remove_faq(index: number) {
    set_faq_items((prev) => prev.filter((_, i) => i !== index));
  }

  function update_faq(index: number, field: keyof FaqItem, value: string) {
    set_faq_items((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
  }

  async function save(publish: boolean) {
    if (!title.trim() || !slug.trim()) {
      set_error("Title and slug are required.");
      return;
    }

    set_saving(true);
    set_error("");

    const payload: Record<string, unknown> = {
      title: title.trim(),
      slug: slug.trim(),
      content,
      category_id: category_id || null,
      meta_title: meta_title.trim(),
      meta_description: meta_description.trim(),
      faq_json: JSON.stringify(faq_items.filter((f) => f.question || f.answer)),
      publish_date: publish_date || null,
    };

    if (publish) {
      payload.status = "published";
      if (!publish_date) {
        payload.publish_date = new Date().toISOString();
      }
    }

    try {
      let res: Response;
      if (post_id) {
        res = await fetch(`/api/admin/blog/${post_id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch("/api/admin/blog", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        set_error((data as { error?: string }).error ?? "Failed to save.");
        return;
      }

      router.push("/admin/blog");
      router.refresh();
    } catch {
      set_error("Network error. Please try again.");
    } finally {
      set_saving(false);
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => set_title(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="Post title"
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Slug *</label>
        <input
          type="text"
          value={slug}
          onChange={(e) => {
            set_slug_edited(true);
            set_slug(e.target.value);
          }}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="url-friendly-slug"
        />
        <p className="text-xs text-gray-500 mt-1">Will be accessible at /blog/{slug || "your-slug"}</p>
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
        <select
          value={category_id}
          onChange={(e) => set_category_id(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 bg-white"
        >
          <option value="">— No category —</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Content */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Content (MDX)</label>
        <textarea
          value={content}
          onChange={(e) => set_content(e.target.value)}
          rows={20}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
          placeholder="Write your post content in MDX format..."
        />
      </div>

      {/* Meta Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Title{" "}
          <span className={`text-xs ${meta_title.length > 60 ? "text-red-500" : "text-gray-400"}`}>
            ({meta_title.length}/60)
          </span>
        </label>
        <input
          type="text"
          value={meta_title}
          onChange={(e) => set_meta_title(e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          placeholder="SEO title (defaults to post title)"
        />
      </div>

      {/* Meta Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Meta Description{" "}
          <span
            className={`text-xs ${meta_description.length > 160 ? "text-red-500" : "text-gray-400"}`}
          >
            ({meta_description.length}/160)
          </span>
        </label>
        <textarea
          value={meta_description}
          onChange={(e) => set_meta_description(e.target.value)}
          rows={3}
          className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-none"
          placeholder="SEO description"
        />
      </div>

      {/* Publish Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Publish Date (optional — future date sets status to &quot;scheduled&quot;)
        </label>
        <input
          type="datetime-local"
          value={publish_date}
          onChange={(e) => set_publish_date(e.target.value)}
          className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
        />
      </div>

      {/* FAQ Items */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="block text-sm font-medium text-gray-700">FAQ Items</label>
          <button
            type="button"
            onClick={add_faq}
            className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
          >
            + Add FAQ
          </button>
        </div>
        <div className="space-y-4">
          {faq_items.map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-md p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-gray-500">FAQ #{index + 1}</span>
                <button
                  type="button"
                  onClick={() => remove_faq(index)}
                  className="text-xs text-red-500 hover:text-red-700 transition-colors"
                >
                  Remove
                </button>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Question</label>
                <input
                  type="text"
                  value={item.question}
                  onChange={(e) => update_faq(index, "question", e.target.value)}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                  placeholder="What is..."
                />
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Answer</label>
                <textarea
                  value={item.answer}
                  onChange={(e) => update_faq(index, "answer", e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400 resize-y"
                  placeholder="The answer is..."
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 pt-4 border-t">
        <button
          type="button"
          onClick={() => save(false)}
          disabled={saving}
          className="px-4 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Save as Draft"}
        </button>
        <button
          type="button"
          onClick={() => save(true)}
          disabled={saving}
          className="px-4 py-2 bg-gray-900 text-white text-sm rounded-md hover:bg-gray-700 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving…" : "Publish"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin/blog")}
          className="px-4 py-2 text-gray-500 text-sm hover:text-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
