"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { IconPicker } from "./icon-picker";
import { ColorPicker } from "./color-picker";
import { TimerPreviewPanel } from "./timer-preview";
import { use_hazo_auth } from "hazo_auth/client";
import { toast } from "sonner";
import { X, LogIn, Link2 } from "lucide-react";
import Link from "next/link";

type Category = { id: string; name: string };

type SaveTimerDialogProps = {
  open: boolean;
  on_close: () => void;
  timer_type: string;
  default_title: string;
  config: Record<string, unknown>;
};

export function SaveTimerDialog({
  open, on_close, timer_type, default_title, config,
}: SaveTimerDialogProps) {
  const { authenticated } = use_hazo_auth({});

  const [title, set_title] = useState(default_title);
  const [icon, set_icon] = useState("⏱️");
  const [color, set_color] = useState("#E8613C");
  const [category_id, set_category_id] = useState<string | null>(null);
  const [new_category_name, set_new_category_name] = useState("");
  const [show_new_category, set_show_new_category] = useState(false);
  const [categories, set_categories] = useState<Category[]>([]);
  const [saving, set_saving] = useState(false);
  const [copied, set_copied] = useState(false);

  useEffect(() => { if (open) set_title(default_title); }, [open, default_title]);
  useEffect(() => {
    if (open && authenticated) {
      fetch("/api/studio/categories")
        .then((r) => r.json())
        .then((d) => set_categories(Array.isArray(d) ? d : d.categories || []))
        .catch(() => set_categories([]));
    }
  }, [open, authenticated]);

  if (!open) return null;

  const handle_copy_link = () => {
    const params = new URLSearchParams();
    Object.entries(config).forEach(([k, v]) => { if (v != null) params.set(k, String(v)); });
    navigator.clipboard.writeText(`${window.location.origin}/${timer_type}?${params.toString()}`);
    set_copied(true);
    setTimeout(() => set_copied(false), 2000);
    toast.success("Link copied");
  };

  const handle_save = async () => {
    if (!title.trim()) { toast.error("Please enter a name"); return; }
    set_saving(true);
    try {
      let final_cat_id = category_id;
      if (show_new_category && new_category_name.trim()) {
        const r = await fetch("/api/studio/categories", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: new_category_name.trim() }) });
        if (r.ok) final_cat_id = (await r.json()).id;
      }
      const res = await fetch("/api/studio/timers", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: title.trim(), type: timer_type, icon, accent_color: color, category_id: final_cat_id, config_json: JSON.stringify(config) }),
      });
      if (res.ok) { toast.success("Saved to Studio"); on_close(); }
      else { toast.error((await res.json()).error || "Failed to save"); }
    } catch { toast.error("Failed to save"); }
    finally { set_saving(false); }
  };

  // Non-authenticated prompt
  if (!authenticated) {
    return (
      <div className="fixed inset-0 z-50">
        <div className="absolute inset-0 bg-black/50" onClick={on_close} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border w-[min(90vw,380px)] p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold">Save Timer</h3>
            <button onClick={on_close} className="rounded-sm opacity-70 hover:opacity-100 p-1"><X className="w-4 h-4" /></button>
          </div>
          <p className="text-sm text-muted-foreground mb-4">Sign in to save timers to your Studio</p>
          <div className="flex flex-col gap-2">
            <Button asChild><Link href="/hazo_auth/login"><LogIn className="w-4 h-4 mr-2" />Sign In</Link></Button>
            <Button variant="outline" onClick={handle_copy_link}><Link2 className="w-4 h-4 mr-2" />{copied ? "Copied!" : "Copy Timer Link"}</Button>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated — two-panel layout with preview
  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={on_close} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border overflow-hidden w-[min(94vw,740px)] h-[min(85vh,520px)] flex">

        {/* Left: Settings */}
        <div className="w-[320px] shrink-0 flex flex-col border-r">
          <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
            <h2 className="text-sm font-semibold">Save Timer</h2>
            <button onClick={on_close} className="rounded-sm opacity-70 hover:opacity-100 p-1"><X className="w-4 h-4" /></button>
          </div>

          <div className="overflow-y-auto flex-1 px-4 pb-2 space-y-3">
            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Name</label>
              <Input value={title} onChange={(e) => set_title(e.target.value)} placeholder="Timer name" className="h-9 text-sm" />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Category</label>
              {show_new_category ? (
                <div className="flex gap-2">
                  <Input value={new_category_name} onChange={(e) => set_new_category_name(e.target.value)}
                    placeholder="New category" className="flex-1 h-8 text-sm" autoFocus
                    onKeyDown={(e) => { if (e.key === "Escape") { set_show_new_category(false); set_new_category_name(""); } }} />
                  <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => { set_show_new_category(false); set_new_category_name(""); }}>Cancel</Button>
                </div>
              ) : (
                <select value={category_id || ""} onChange={(e) => {
                  if (e.target.value === "__new__") { set_show_new_category(true); set_category_id(null); }
                  else set_category_id(e.target.value || null);
                }}
                  className="w-full h-8 px-2 border border-input rounded-md text-xs bg-background focus:outline-none focus:ring-1 focus:ring-ring">
                  <option value="">Uncategorized</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  <option value="__new__">+ New Category</option>
                </select>
              )}
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Icon</label>
              <IconPicker value={icon} onChange={set_icon} />
            </div>

            <div>
              <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-1 block">Color</label>
              <ColorPicker value={color} onChange={set_color} />
            </div>
          </div>

          <div className="flex justify-end gap-2 px-4 py-3 border-t shrink-0">
            <Button variant="outline" size="sm" onClick={on_close}>Cancel</Button>
            <Button size="sm" disabled={saving || !title.trim()} onClick={handle_save}>
              {saving ? "Saving..." : "Save to Studio"}
            </Button>
          </div>
        </div>

        {/* Right: Live preview */}
        <div className="flex-1 min-w-0 hidden sm:block">
          <TimerPreviewPanel
            timer_type={timer_type}
            config={config}
            label={title || timer_type}
          />
        </div>
      </div>
    </div>
  );
}
