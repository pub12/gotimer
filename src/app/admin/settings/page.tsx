"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { Save, CheckCircle } from "lucide-react";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type FormState = {
  site_name: string;
  tagline: string;
  contact_email: string;
  hero_rotating_text: string;
  twitter_url: string;
  instagram_url: string;
  youtube_url: string;
};

const DEFAULTS: FormState = {
  site_name: "GoTimer",
  tagline: "",
  contact_email: "",
  hero_rotating_text: "",
  twitter_url: "",
  instagram_url: "",
  youtube_url: "",
};

function Field({
  label,
  name,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  name: keyof FormState;
  value: string;
  onChange: (name: keyof FormState, val: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(name, e.target.value)}
        placeholder={placeholder}
        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30"
      />
    </div>
  );
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [form, set_form] = useState<FormState>(DEFAULTS);
  const [fetch_loading, set_fetch_loading] = useState(true);
  const [saving, set_saving] = useState(false);
  const [saved, set_saved] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (loading || !authenticated || !permission_ok) return;
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data: { settings: Record<string, string> }) => {
        const s = data.settings ?? {};
        set_form({
          site_name: s.site_name ?? DEFAULTS.site_name,
          tagline: s.tagline ?? "",
          contact_email: s.contact_email ?? "",
          hero_rotating_text: s.hero_rotating_text ?? "",
          twitter_url: s.twitter_url ?? "",
          instagram_url: s.instagram_url ?? "",
          youtube_url: s.youtube_url ?? "",
        });
      })
      .catch(() => {})
      .finally(() => set_fetch_loading(false));
  }, [loading, authenticated, permission_ok]);

  async function handle_save(e: React.FormEvent) {
    e.preventDefault();
    set_saving(true);
    set_error("");
    set_saved(false);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Save failed");
      set_saved(true);
      setTimeout(() => set_saved(false), 3000);
    } catch {
      set_error("Failed to save settings. Please try again.");
    } finally {
      set_saving(false);
    }
  }

  function handle_change(name: keyof FormState, val: string) {
    set_form((f) => ({ ...f, [name]: val }));
  }

  if (loading) return <div className="p-8">Loading...</div>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8 max-w-2xl">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Site Settings</h1>

      {fetch_loading ? (
        <p className="text-gray-500">Loading settings...</p>
      ) : (
        <form onSubmit={handle_save} className="space-y-8">
          {/* General */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">General</h2>
            <Field label="Site Name" name="site_name" value={form.site_name} onChange={handle_change} placeholder="GoTimer" />
            <Field label="Tagline" name="tagline" value={form.tagline} onChange={handle_change} placeholder="Your tagline here" />
            <Field label="Contact Email" name="contact_email" value={form.contact_email} onChange={handle_change} type="email" placeholder="hello@gotimer.org" />
          </section>

          {/* Homepage */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Homepage</h2>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Hero Rotating Text</label>
              <p className="text-xs text-gray-400 mb-2">One phrase per line. These rotate in the hero banner.</p>
              <textarea
                value={form.hero_rotating_text}
                onChange={(e) => handle_change("hero_rotating_text", e.target.value)}
                rows={5}
                placeholder={"chess matches\nboard game nights\npub quizzes"}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6B35]/30 font-mono"
              />
            </div>
          </section>

          {/* Social Media */}
          <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h2 className="text-base font-semibold text-gray-800">Social Media</h2>
            <Field label="Twitter / X URL" name="twitter_url" value={form.twitter_url} onChange={handle_change} placeholder="https://twitter.com/gotimer" />
            <Field label="Instagram URL" name="instagram_url" value={form.instagram_url} onChange={handle_change} placeholder="https://instagram.com/gotimer" />
            <Field label="YouTube URL" name="youtube_url" value={form.youtube_url} onChange={handle_change} placeholder="https://youtube.com/@gotimer" />
          </section>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#FF6B35] text-white rounded-lg text-sm font-medium hover:bg-[#e55a2b] disabled:opacity-50 border-none cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {saved && (
              <span className="flex items-center gap-1.5 text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4" />
                Saved
              </span>
            )}
          </div>
        </form>
      )}
    </main>
  );
}
