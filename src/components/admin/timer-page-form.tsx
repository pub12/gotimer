"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Plus, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface FaqItem {
  question: string;
  answer: string;
}

interface TimerPageData {
  id?: string;
  slug: string;
  title: string;
  timer_type: string;
  intro_html: string;
  faq_json: string;
  meta_title: string;
  meta_description: string;
  timer_config_json: string;
  character_id?: string | null;
  status?: string;
}

interface TimerPageFormProps {
  initial_data?: TimerPageData;
  mode: "create" | "edit";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

const TIMER_TYPES = [
  { value: "countdown", label: "Countdown" },
  { value: "interval", label: "Interval" },
  { value: "stopwatch", label: "Stopwatch" },
];

export default function TimerPageForm({ initial_data, mode }: TimerPageFormProps) {
  const router = useRouter();
  const [active_tab, set_active_tab] = useState<"content" | "seo" | "timer">("content");
  const [saving, set_saving] = useState(false);
  const [error, set_error] = useState<string | null>(null);

  // Content fields
  const [title, set_title] = useState(initial_data?.title ?? "");
  const [slug, set_slug] = useState(initial_data?.slug ?? "");
  const [slug_manually_edited, set_slug_manually_edited] = useState(false);
  const [intro_html, set_intro_html] = useState(initial_data?.intro_html ?? "");
  const [faq_items, set_faq_items] = useState<FaqItem[]>(() => {
    try {
      const parsed = JSON.parse(initial_data?.faq_json ?? "[]");
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  });

  // SEO fields
  const [meta_title, set_meta_title] = useState(initial_data?.meta_title ?? "");
  const [meta_description, set_meta_description] = useState(initial_data?.meta_description ?? "");

  // Timer config fields
  const [timer_type, set_timer_type] = useState(initial_data?.timer_type ?? "countdown");
  const [duration, set_duration] = useState<number>(() => {
    try {
      const config = JSON.parse(initial_data?.timer_config_json ?? "{}");
      return config.duration ?? 60;
    } catch {
      return 60;
    }
  });
  const [work_seconds, set_work_seconds] = useState<number>(() => {
    try {
      const config = JSON.parse(initial_data?.timer_config_json ?? "{}");
      return config.work_seconds ?? 30;
    } catch {
      return 30;
    }
  });
  const [rest_seconds, set_rest_seconds] = useState<number>(() => {
    try {
      const config = JSON.parse(initial_data?.timer_config_json ?? "{}");
      return config.rest_seconds ?? 10;
    } catch {
      return 10;
    }
  });
  const [rounds, set_rounds] = useState<number>(() => {
    try {
      const config = JSON.parse(initial_data?.timer_config_json ?? "{}");
      return config.rounds ?? 8;
    } catch {
      return 8;
    }
  });

  // Auto-generate slug from title
  useEffect(() => {
    if (mode === "create" && !slug_manually_edited) {
      set_slug(slugify(title));
    }
  }, [title, mode, slug_manually_edited]);

  function build_timer_config(): string {
    if (timer_type === "interval") {
      return JSON.stringify({ work_seconds, rest_seconds, rounds });
    }
    if (timer_type === "stopwatch") {
      return JSON.stringify({});
    }
    return JSON.stringify({ duration });
  }

  async function handle_save() {
    set_error(null);

    if (!title.trim()) {
      set_error("Title is required");
      return;
    }
    if (!slug.trim()) {
      set_error("Slug is required");
      return;
    }

    set_saving(true);

    const body = {
      title: title.trim(),
      slug: slug.trim(),
      timer_type,
      intro_html,
      faq_json: JSON.stringify(faq_items),
      meta_title: meta_title.trim(),
      meta_description: meta_description.trim(),
      timer_config_json: build_timer_config(),
    };

    try {
      const url =
        mode === "edit" && initial_data?.id
          ? `/api/admin/timer-pages/${initial_data.id}`
          : "/api/admin/timer-pages";
      const method = mode === "edit" ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }

      router.push("/admin/timer-pages");
      router.refresh();
    } catch (err) {
      set_error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      set_saving(false);
    }
  }

  function add_faq() {
    set_faq_items([...faq_items, { question: "", answer: "" }]);
  }

  function update_faq(index: number, field: "question" | "answer", value: string) {
    const updated = [...faq_items];
    updated[index] = { ...updated[index], [field]: value };
    set_faq_items(updated);
  }

  function remove_faq(index: number) {
    set_faq_items(faq_items.filter((_, i) => i !== index));
  }

  const tabs = [
    { id: "content" as const, label: "Content" },
    { id: "seo" as const, label: "SEO" },
    { id: "timer" as const, label: "Timer Config" },
  ];

  return (
    <div>
      {/* Back link */}
      <Link
        href="/admin/timer-pages"
        className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm mb-4 no-underline"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Timer Pages
      </Link>

      {/* Tab navigation */}
      <div className="flex gap-1 border-b border-gray-200 mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => set_active_tab(tab.id)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors bg-transparent cursor-pointer ${
              active_tab === tab.id
                ? "border-blue-600 text-blue-600"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
          {error}
        </div>
      )}

      {/* Content Tab */}
      {active_tab === "content" && (
        <div className="space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => set_title(e.target.value)}
              placeholder="e.g., 5 Minute Timer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Slug */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Slug</label>
            <div className="flex items-center">
              <span className="text-gray-400 text-sm mr-1">/</span>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  set_slug(e.target.value);
                  set_slug_manually_edited(true);
                }}
                placeholder="5-minute-timer"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Intro HTML */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Introduction (HTML)
            </label>
            <textarea
              value={intro_html}
              onChange={(e) => set_intro_html(e.target.value)}
              rows={8}
              placeholder="<p>This free 5 minute timer is perfect for...</p>"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* FAQ items */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">FAQ Items</label>
            {faq_items.length === 0 && (
              <p className="text-sm text-gray-400 mb-3">No FAQ items yet.</p>
            )}
            <div className="space-y-4">
              {faq_items.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg p-4 relative">
                  <button
                    onClick={() => remove_faq(idx)}
                    className="absolute top-3 right-3 text-gray-400 hover:text-red-500 bg-transparent border-none cursor-pointer"
                    aria-label="Remove FAQ"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="space-y-3 pr-8">
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Question
                      </label>
                      <input
                        type="text"
                        value={item.question}
                        onChange={(e) => update_faq(idx, "question", e.target.value)}
                        placeholder="How long is 5 minutes?"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-500 mb-1">
                        Answer (HTML)
                      </label>
                      <textarea
                        value={item.answer}
                        onChange={(e) => update_faq(idx, "answer", e.target.value)}
                        rows={3}
                        placeholder="<p>5 minutes equals 300 seconds.</p>"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={add_faq}
              className="mt-3 inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium bg-transparent border-none cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Add FAQ Item
            </button>
          </div>
        </div>
      )}

      {/* SEO Tab */}
      {active_tab === "seo" && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Meta Title
              <span className={`ml-2 text-xs font-normal ${
                meta_title.length >= 50 && meta_title.length <= 60
                  ? "text-green-600"
                  : meta_title.length > 60
                  ? "text-red-500"
                  : "text-gray-400"
              }`}>
                {meta_title.length}/60
              </span>
            </label>
            <input
              type="text"
              value={meta_title}
              onChange={(e) => set_meta_title(e.target.value)}
              placeholder="5 Minute Timer - Free Online Timer | GoTimer"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Target: 50-60 characters</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Meta Description
              <span className={`ml-2 text-xs font-normal ${
                meta_description.length >= 150 && meta_description.length <= 160
                  ? "text-green-600"
                  : meta_description.length > 160
                  ? "text-red-500"
                  : "text-gray-400"
              }`}>
                {meta_description.length}/160
              </span>
            </label>
            <textarea
              value={meta_description}
              onChange={(e) => set_meta_description(e.target.value)}
              rows={3}
              placeholder="Free 5 minute timer with audio alerts. Start a 5 min countdown timer instantly..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <p className="text-xs text-gray-400 mt-1">Target: 150-160 characters</p>
          </div>

          {/* Preview */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-400 mb-2 uppercase tracking-wide font-medium">
              Search preview
            </p>
            <div className="font-medium text-blue-700 text-base truncate">
              {meta_title || title || "Page Title"}
            </div>
            <div className="text-green-700 text-xs mt-0.5">
              gotimer.org/{slug || "page-slug"}
            </div>
            <div className="text-gray-600 text-sm mt-1 line-clamp-2">
              {meta_description || "Page description will appear here..."}
            </div>
          </div>
        </div>
      )}

      {/* Timer Config Tab */}
      {active_tab === "timer" && (
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Timer Type</label>
            <select
              value={timer_type}
              onChange={(e) => set_timer_type(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {TIMER_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {timer_type === "countdown" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Default Duration (seconds)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => set_duration(Number(e.target.value))}
                min={1}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">
                {Math.floor(duration / 60)}m {duration % 60}s
              </p>
            </div>
          )}

          {timer_type === "interval" && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Work Seconds
                </label>
                <input
                  type="number"
                  value={work_seconds}
                  onChange={(e) => set_work_seconds(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Rest Seconds
                </label>
                <input
                  type="number"
                  value={rest_seconds}
                  onChange={(e) => set_rest_seconds(Number(e.target.value))}
                  min={0}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Rounds</label>
                <input
                  type="number"
                  value={rounds}
                  onChange={(e) => set_rounds(Number(e.target.value))}
                  min={1}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </>
          )}

          {timer_type === "stopwatch" && (
            <p className="text-sm text-gray-500">
              Stopwatch has no configuration — it counts up from zero.
            </p>
          )}
        </div>
      )}

      {/* Save button */}
      <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
        <button
          onClick={handle_save}
          disabled={saving}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors text-sm cursor-pointer border-none"
        >
          <Save className="w-4 h-4" />
          {saving ? "Saving..." : mode === "edit" ? "Update Page" : "Create Page"}
        </button>
        <Link
          href="/admin/timer-pages"
          className="text-gray-500 hover:text-gray-700 text-sm no-underline"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
}
