"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { TimerTile } from "./timer-tile";
import { use_hazo_auth } from "hazo_auth/client";
import { Plus, Timer, FolderOpen, LayoutGrid, MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { AddTimerFlow } from "./add-timer-flow";
import { EditTimerDialog } from "./edit-timer-dialog";

type SavedTimer = {
  id: string;
  title: string;
  type: string;
  icon: string;
  accent_color: string;
  config_json: string;
  category_id: string | null;
};

type Category = {
  id: string;
  name: string;
  timer_count: number;
};

export default function StudioPage() {
  const { user, authenticated } = use_hazo_auth({});

  const [timers, set_timers] = useState<SavedTimer[]>([]);
  const [categories, set_categories] = useState<Category[]>([]);
  const [selected_category, set_selected_category] = useState<string | null>(null);
  const [loading, set_loading] = useState(true);

  // Add Timer dialog state
  const [add_timer_open, set_add_timer_open] = useState(false);

  // Edit Timer dialog state
  const [editing_timer, set_editing_timer] = useState<SavedTimer | null>(null);

  // Category menu/rename/delete state
  const [cat_menu_id, set_cat_menu_id] = useState<string | null>(null);
  const [rename_cat, set_rename_cat] = useState<{ id: string; name: string } | null>(null);
  const [rename_value, set_rename_value] = useState("");
  const [delete_cat, set_delete_cat] = useState<{ id: string; name: string; timer_count: number } | null>(null);

  // New Category dialog state
  const [new_cat_open, set_new_cat_open] = useState(false);
  const [new_cat_name, set_new_cat_name] = useState("");
  const [new_cat_saving, set_new_cat_saving] = useState(false);

  const fetch_data = useCallback(async () => {
    set_loading(true);
    try {
      const [timers_res, cats_res] = await Promise.all([
        fetch("/api/studio/timers"),
        fetch("/api/studio/categories"),
      ]);
      const timers_data = await timers_res.json();
      const cats_data = await cats_res.json();

      set_timers(Array.isArray(timers_data) ? timers_data : timers_data.timers || []);
      set_categories(Array.isArray(cats_data) ? cats_data : cats_data.categories || []);
    } catch {
      set_timers([]);
      set_categories([]);
    } finally {
      set_loading(false);
    }
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetch_data();
    } else {
      set_loading(false);
    }
  }, [authenticated, fetch_data]);

  const handle_create_category = async () => {
    if (!new_cat_name.trim()) return;
    set_new_cat_saving(true);
    try {
      const res = await fetch("/api/studio/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: new_cat_name.trim() }),
      });
      if (res.ok) {
        fetch_data();
        set_new_cat_open(false);
        set_new_cat_name("");
      }
    } catch {
      /* ignore */
    } finally {
      set_new_cat_saving(false);
    }
  };

  const filtered_timers =
    selected_category === null
      ? timers
      : selected_category === "__uncategorized__"
        ? timers.filter((t) => !t.category_id)
        : timers.filter((t) => t.category_id === selected_category);

  const uncategorized_count = timers.filter((t) => !t.category_id).length;

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <Timer className="w-12 h-12 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-headline font-black mb-2">My Timer Studio</h2>
        <p className="text-muted-foreground mb-6 max-w-md">
          Sign in to save your favorite timer configurations and access them anytime.
        </p>
        <Button asChild>
          <Link href="/hazo_auth/login">Sign In to Get Started</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="flex gap-6 max-w-7xl mx-auto px-4 py-8">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-60 shrink-0">
        <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] p-4 sticky top-20">
          {user?.name && (
            <p className="font-headline font-black text-sm mb-4 truncate px-1">
              {user.name}
            </p>
          )}

          <nav className="flex flex-col gap-0.5">
            <button
              className={`flex items-center justify-between px-3 py-2.5 rounded-[0.75rem] text-sm font-medium transition-all duration-150 cursor-pointer ${
                selected_category === null
                  ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                  : "text-foreground hover:bg-surface-container-high"
              }`}
              onClick={() => set_selected_category(null)}
            >
              <span className="flex items-center gap-2">
                <LayoutGrid className="w-4 h-4" />
                All Timers
              </span>
              <span className="text-xs opacity-70">{timers.length}</span>
            </button>

            {uncategorized_count > 0 && (
              <button
                className={`flex items-center justify-between px-3 py-2.5 rounded-[0.75rem] text-sm font-medium transition-all duration-150 cursor-pointer ${
                  selected_category === "__uncategorized__"
                    ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                    : "text-foreground hover:bg-surface-container-high"
                }`}
                onClick={() => set_selected_category("__uncategorized__")}
              >
                <span className="flex items-center gap-2">
                  <FolderOpen className="w-4 h-4" />
                  Uncategorized
                </span>
                <span className="text-xs opacity-70">{uncategorized_count}</span>
              </button>
            )}

            {categories.map((cat) => (
              <div key={cat.id} className="relative group">
                <button
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[0.75rem] text-sm font-medium transition-all duration-150 cursor-pointer ${
                    selected_category === cat.id
                      ? "bg-primary text-primary-foreground shadow-[var(--shadow-soft)]"
                      : "text-foreground hover:bg-surface-container-high"
                  }`}
                  onClick={() => set_selected_category(cat.id)}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="flex items-center gap-1">
                    <span className="text-xs opacity-70">{cat.timer_count}</span>
                    <span
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded hover:bg-white/20"
                      onClick={(e) => { e.stopPropagation(); set_cat_menu_id(cat_menu_id === cat.id ? null : cat.id); }}
                    >
                      <MoreVertical className="w-3.5 h-3.5" />
                    </span>
                  </span>
                </button>
                {cat_menu_id === cat.id && (
                  <div className="absolute right-0 top-9 z-20 w-36 bg-card rounded-lg shadow-lg border py-1">
                    <button className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface-container-low transition-colors"
                      onClick={() => { set_cat_menu_id(null); set_rename_cat({ id: cat.id, name: cat.name }); set_rename_value(cat.name); }}>
                      <Pencil className="w-3.5 h-3.5" />Rename
                    </button>
                    <button className="w-full px-3 py-2 text-sm text-left flex items-center gap-2 hover:bg-surface-container-low transition-colors text-destructive"
                      onClick={() => { set_cat_menu_id(null); set_delete_cat({ id: cat.id, name: cat.name, timer_count: cat.timer_count }); }}>
                      <Trash2 className="w-3.5 h-3.5" />Delete
                    </button>
                  </div>
                )}
              </div>
            ))}

            <button
              className="flex items-center gap-2 px-3 py-2.5 rounded-[0.75rem] text-sm text-muted-foreground hover:bg-surface-container-high transition-colors cursor-pointer mt-1"
              onClick={() => set_new_cat_open(true)}
            >
              <Plus className="w-4 h-4" />
              New Category
            </button>
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-black">My Timer Studio</h1>
          <Button variant="secondary" onClick={() => set_add_timer_open(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add Timer
          </Button>
        </div>

        {/* Mobile category chips */}
        <div className="lg:hidden flex gap-2 overflow-x-auto pb-3 mb-4 -mx-1 px-1 scrollbar-none">
          <button
            className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              selected_category === null
                ? "bg-primary text-primary-foreground"
                : "bg-surface-container-low text-foreground"
            }`}
            onClick={() => set_selected_category(null)}
          >
            All ({timers.length})
          </button>
          {uncategorized_count > 0 && (
            <button
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selected_category === "__uncategorized__"
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-container-low text-foreground"
              }`}
              onClick={() => set_selected_category("__uncategorized__")}
            >
              Uncategorized ({uncategorized_count})
            </button>
          )}
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                selected_category === cat.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-surface-container-low text-foreground"
              }`}
              onClick={() => set_selected_category(cat.id)}
            >
              {cat.name} ({cat.timer_count})
            </button>
          ))}
        </div>

        {/* Timer grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] h-44 animate-pulse"
              />
            ))}
          </div>
        ) : filtered_timers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <Timer className="w-10 h-10 text-muted-foreground mb-3" />
            <p className="text-muted-foreground text-sm">
              {timers.length === 0
                ? "No saved timers yet. Use any timer and tap the bookmark icon to save it here."
                : "No timers in this category."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered_timers.map((timer) => (
              <TimerTile
                key={timer.id}
                id={timer.id}
                title={timer.title}
                timer_type={timer.type}
                icon={timer.icon}
                color={timer.accent_color}
                config={typeof timer.config_json === "string" ? JSON.parse(timer.config_json || "{}") : {}}
                category_name={timer.category_id ? categories.find(c => c.id === timer.category_id)?.name || null : null}
                on_deleted={fetch_data}
                on_duplicated={fetch_data}
                on_edit={() => set_editing_timer(timer)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Edit Timer Dialog */}
      <EditTimerDialog
        open={!!editing_timer}
        on_close={() => set_editing_timer(null)}
        on_saved={fetch_data}
        timer={editing_timer ? {
          id: editing_timer.id,
          title: editing_timer.title,
          type: editing_timer.type,
          icon: editing_timer.icon,
          accent_color: editing_timer.accent_color,
          config_json: editing_timer.config_json,
          category_id: editing_timer.category_id,
        } : null}
      />

      {/* Add Timer Flow */}
      <AddTimerFlow
        open={add_timer_open}
        on_close={() => set_add_timer_open(false)}
        on_saved={fetch_data}
      />

      {/* New Category Dialog */}
      <Dialog open={new_cat_open} onOpenChange={set_new_cat_open}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Category</DialogTitle>
            <DialogDescription>
              Create a category to organize your saved timers.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Input
              placeholder="Category name"
              value={new_cat_name}
              onChange={(e) => set_new_cat_name(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handle_create_category(); }}
              autoFocus
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { set_new_cat_open(false); set_new_cat_name(""); }}>
              Cancel
            </Button>
            <Button onClick={handle_create_category} disabled={!new_cat_name.trim() || new_cat_saving}>
              {new_cat_saving ? "Creating..." : "Create Category"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rename Category Dialog */}
      {rename_cat && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => set_rename_cat(null)} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border w-[min(90vw,400px)] p-5">
            <h3 className="text-sm font-semibold mb-3">Rename Category</h3>
            <Input value={rename_value} onChange={(e) => set_rename_value(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") {
                fetch(`/api/studio/categories/${rename_cat.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: rename_value.trim() }) })
                  .then((r) => { if (r.ok) { toast.success("Category renamed"); fetch_data(); } else toast.error("Failed to rename"); })
                  .catch(() => toast.error("Failed to rename"));
                set_rename_cat(null);
              }}}
              autoFocus placeholder="Category name" className="mb-4" />
            <div className="flex justify-end gap-2">
              <Button variant="outline" size="sm" onClick={() => set_rename_cat(null)}>Cancel</Button>
              <Button size="sm" disabled={!rename_value.trim()} onClick={() => {
                fetch(`/api/studio/categories/${rename_cat.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: rename_value.trim() }) })
                  .then((r) => { if (r.ok) { toast.success("Category renamed"); fetch_data(); } else toast.error("Failed to rename"); })
                  .catch(() => toast.error("Failed to rename"));
                set_rename_cat(null);
              }}>Rename</Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Category Confirmation */}
      {delete_cat && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => set_delete_cat(null)} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background rounded-xl shadow-2xl border w-[min(90vw,420px)] p-5">
            <h3 className="text-sm font-semibold mb-2">Delete &ldquo;{delete_cat.name}&rdquo;?</h3>
            {delete_cat.timer_count > 0 ? (
              <>
                <p className="text-sm text-muted-foreground mb-4">
                  This category has {delete_cat.timer_count} timer{delete_cat.timer_count !== 1 ? "s" : ""}. Do you want to delete them too?
                </p>
                <div className="flex flex-col gap-2">
                  <Button variant="destructive" size="sm" onClick={async () => {
                    // Delete timers in category first, then delete category
                    const timers_in_cat = timers.filter((t) => t.category_id === delete_cat.id);
                    for (const t of timers_in_cat) {
                      await fetch(`/api/studio/timers/${t.id}`, { method: "DELETE" });
                    }
                    await fetch(`/api/studio/categories/${delete_cat.id}`, { method: "DELETE" });
                    toast.success("Category and timers deleted");
                    set_delete_cat(null); set_selected_category(null); fetch_data();
                  }}>Delete category and timers</Button>
                  <Button variant="outline" size="sm" onClick={async () => {
                    // Just delete category — FK ON DELETE SET NULL moves timers to uncategorized
                    await fetch(`/api/studio/categories/${delete_cat.id}`, { method: "DELETE" });
                    toast.success("Category deleted, timers moved to Uncategorized");
                    set_delete_cat(null); set_selected_category(null); fetch_data();
                  }}>Delete category, keep timers</Button>
                  <Button variant="ghost" size="sm" onClick={() => set_delete_cat(null)}>Cancel</Button>
                </div>
              </>
            ) : (
              <>
                <p className="text-sm text-muted-foreground mb-4">This category is empty.</p>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => set_delete_cat(null)}>Cancel</Button>
                  <Button variant="destructive" size="sm" onClick={async () => {
                    await fetch(`/api/studio/categories/${delete_cat.id}`, { method: "DELETE" });
                    toast.success("Category deleted");
                    set_delete_cat(null); set_selected_category(null); fetch_data();
                  }}>Delete</Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
