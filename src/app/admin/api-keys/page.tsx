"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { Key, Trash2, Shield, User } from "lucide-react";

const REQUIRED_PERMISSIONS: string[] = ["admin_view_all_games"];

type AdminKey = {
  name: string;
  key_preview: string;
  created_at: string;
  source: "admin";
};

type UserKey = {
  id: string;
  name: string;
  key_preview: string;
  user_id: string;
  created_at: string;
  source: "user";
};

type ApiKeysData = {
  admin_keys: AdminKey[];
  user_keys: UserKey[];
  total: number;
};

export default function AdminApiKeysPage() {
  const router = useRouter();
  const {
    authenticated,
    permission_ok,
    loading: auth_loading,
  } = use_hazo_auth({ required_permissions: REQUIRED_PERMISSIONS });

  const [data, set_data] = useState<ApiKeysData | null>(null);
  const [loading, set_loading] = useState(true);
  const [fetch_error, set_fetch_error] = useState<string | null>(null);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) {
      router.push("/");
    }
  }, [auth_loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok) return;

    set_loading(true);
    fetch("/api/admin/all-api-keys")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((d) => {
        set_data(d);
        set_fetch_error(null);
      })
      .catch((err) => set_fetch_error(err.message))
      .finally(() => set_loading(false));
  }, [auth_loading, authenticated, permission_ok]);

  async function handle_delete(id: string) {
    if (!data) return;

    // Optimistic update
    const prev = data;
    set_data({
      ...data,
      user_keys: data.user_keys.filter((k) => k.id !== id),
      total: data.total - 1,
    });

    try {
      const res = await fetch(`/api/admin/all-api-keys?id=${encodeURIComponent(id)}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
    } catch {
      // Revert on failure
      set_data(prev);
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

  if (fetch_error) {
    return (
      <main className="p-8 max-w-7xl">
        <h1 className="text-2xl font-headline font-black text-foreground mb-6">
          API Keys
        </h1>
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-[1rem] p-4">
          <Key className="w-5 h-5 shrink-0" />
          <span>Failed to load API keys: {fetch_error}</span>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const all_keys = [
    ...data.admin_keys.map((k) => ({ ...k, id: undefined as string | undefined })),
    ...data.user_keys,
  ];

  return (
    <main className="p-8 max-w-7xl">
      <h1 className="text-2xl font-headline font-black text-foreground mb-6">
        API Keys
      </h1>

      <p className="text-muted-foreground mb-6">
        {data.total} total key{data.total !== 1 ? "s" : ""} ({data.admin_keys.length} admin, {data.user_keys.length} user)
      </p>

      <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-container bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Name
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Key
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Type
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Created
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {all_keys.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  No API keys found.
                </td>
              </tr>
            ) : (
              all_keys.map((key, idx) => (
                <tr
                  key={key.source === "user" ? (key as UserKey).id : `admin-${idx}`}
                  className={`border-b border-surface-container last:border-0 ${
                    idx % 2 === 0 ? "" : "bg-muted/20"
                  } hover:bg-muted/40 transition-colors`}
                >
                  <td className="px-4 py-3 font-medium text-foreground">
                    {key.name}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                    {key.key_preview}
                  </td>
                  <td className="px-4 py-3">
                    {key.source === "admin" ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        <Shield className="w-3 h-3" />
                        admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                        <User className="w-3 h-3" />
                        user
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                    {new Date(key.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {key.source === "admin" ? (
                      <span className="text-xs text-muted-foreground">Manage in settings</span>
                    ) : (
                      <button
                        onClick={() => handle_delete((key as UserKey).id)}
                        className="inline-flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors bg-transparent border-none cursor-pointer"
                        title="Delete key"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
