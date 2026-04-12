"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { ChevronLeft, ChevronRight } from "lucide-react";

const REQUIRED_PERMISSIONS: string[] = ["admin_view_all_games"];

type AuditEntry = {
  id: string;
  admin_user_id: string;
  action: string;
  target_type: string;
  target_id: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
};

function truncate(value: string | null, max = 50): string {
  if (!value) return "—";
  if (value.length <= max) return value;
  return value.slice(0, max) + "…";
}

function format_date(iso: string): string {
  try {
    const d = new Date(iso.endsWith("Z") ? iso : iso + "Z");
    return d.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function AdminAuditLogPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [entries, set_entries] = useState<AuditEntry[]>([]);
  const [total, set_total] = useState(0);
  const [page, set_page] = useState(1);
  const [loading, set_loading] = useState(true);
  const limit = 50;

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) {
      router.push("/");
    }
  }, [auth_loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok) return;

    set_loading(true);
    fetch(`/api/admin/audit-log?page=${page}&limit=${limit}`)
      .then((res) => res.json())
      .then((data) => {
        set_entries(data.entries ?? []);
        set_total(data.total ?? 0);
      })
      .catch(() => {})
      .finally(() => set_loading(false));
  }, [auth_loading, authenticated, permission_ok, page]);

  if (auth_loading || loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!authenticated || !permission_ok) return null;

  const total_pages = Math.max(1, Math.ceil(total / limit));

  return (
    <main className="p-8 max-w-7xl">
      <div className="w-full">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-headline font-black text-foreground">Audit Log (Admin)</h1>
          <p className="text-sm text-muted-foreground">
            {total} total entr{total === 1 ? "y" : "ies"}
          </p>
        </div>

        {entries.length === 0 ? (
          <div className="bg-card rounded-[1rem] p-8 shadow-[var(--shadow-soft)] text-center">
            <p className="text-muted-foreground">No audit log entries found.</p>
          </div>
        ) : (
          <>
            <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b bg-muted/50">
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Timestamp
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Admin
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Action
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Target Type
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Target ID
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      Old Value
                    </th>
                    <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                      New Value
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {entries.map((entry, idx) => (
                    <tr
                      key={entry.id}
                      className={`border-b last:border-0 ${
                        idx % 2 === 0 ? "" : "bg-muted/20"
                      } hover:bg-muted/40 transition-colors`}
                    >
                      <td className="px-4 py-3 whitespace-nowrap text-muted-foreground text-xs">
                        {format_date(entry.created_at)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {truncate(entry.admin_user_id, 20)}
                      </td>
                      <td className="px-4 py-3 font-medium">{entry.action}</td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {entry.target_type}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                        {entry.target_id ? truncate(entry.target_id, 20) : "—"}
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        {entry.old_value ? (
                          <span title={entry.old_value} className="cursor-help">
                            {truncate(entry.old_value)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                      <td className="px-4 py-3 max-w-[200px]">
                        {entry.new_value ? (
                          <span title={entry.new_value} className="cursor-help">
                            {truncate(entry.new_value)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {total_pages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Page {page} of {total_pages}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => set_page((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  <button
                    onClick={() => set_page((p) => Math.min(total_pages, p + 1))}
                    disabled={page === total_pages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm rounded-lg border bg-card hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
