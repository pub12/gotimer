"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { XCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

const REQUIRED_PERMISSIONS: string[] = ["admin_view_all_games"];

type HealthEntry = {
  id: string;
  name: string;
  kind: "strategy" | "preset";
  category?: string;
  strategy?: string;
  in_registry: boolean;
  has_route: boolean;
  in_api: boolean;
};

type HealthData = {
  entries: HealthEntry[];
  errors: string[];
  warnings: string[];
};

export default function TimerHealthPage() {
  const router = useRouter();
  const {
    authenticated,
    permission_ok,
    loading: auth_loading,
  } = use_hazo_auth({ required_permissions: REQUIRED_PERMISSIONS });

  const [data, set_data] = useState<HealthData | null>(null);
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
    fetch("/api/admin/timer-health")
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
          Timer Health
        </h1>
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 text-red-800 rounded-[1rem] p-4">
          <XCircle className="w-5 h-5 shrink-0" />
          <span>Failed to load timer health data: {fetch_error}</span>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const has_errors = data.errors.length > 0;
  const has_warnings = data.warnings.length > 0;

  return (
    <main className="p-8 max-w-7xl">
      <h1 className="text-2xl font-headline font-black text-foreground mb-6">
        Timer Health
      </h1>

      {/* Status banner */}
      {has_errors ? (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 text-red-800 rounded-[1rem] p-4 mb-6">
          <XCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">
              {data.errors.length} error{data.errors.length !== 1 ? "s" : ""} found
            </p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              {data.errors.map((e, i) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {has_warnings ? (
        <div className="flex items-start gap-3 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-[1rem] p-4 mb-6">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium mb-1">
              {data.warnings.length} warning{data.warnings.length !== 1 ? "s" : ""}
            </p>
            <ul className="list-disc ml-4 text-sm space-y-1">
              {data.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}

      {!has_errors && !has_warnings ? (
        <div className="flex items-center gap-3 bg-green-50 border border-green-200 text-green-800 rounded-[1rem] p-4 mb-6">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span className="font-medium">All checks passed</span>
        </div>
      ) : null}

      {/* Timer table */}
      <div className="bg-card rounded-[1rem] shadow-[var(--shadow-soft)] overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-container bg-muted/50">
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Timer
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Type
              </th>
              <th className="text-left px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Category
              </th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Registry
              </th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                Route
              </th>
              <th className="text-center px-4 py-3 font-medium text-muted-foreground whitespace-nowrap">
                API
              </th>
            </tr>
          </thead>
          <tbody>
            {data.entries.map((entry, idx) => (
              <tr
                key={entry.id}
                className={`border-b border-surface-container last:border-0 ${
                  idx % 2 === 0 ? "" : "bg-muted/20"
                } hover:bg-muted/40 transition-colors`}
              >
                <td className="px-4 py-3 font-medium text-foreground">
                  <div>{entry.name}</div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {entry.id}
                  </div>
                </td>
                <td className="px-4 py-3">
                  {entry.kind === "strategy" ? (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                      strategy
                    </span>
                  ) : (
                    <span className="inline-block px-2 py-0.5 text-xs font-medium rounded-full bg-purple-100 text-purple-800">
                      preset
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-muted-foreground">
                  {entry.category ?? "—"}
                </td>
                <td className="px-4 py-3 text-center">
                  {entry.in_registry ? (
                    <span className="text-green-600">&#10003;</span>
                  ) : (
                    <span className="text-red-600">&#10007;</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {entry.has_route ? (
                    <span className="text-green-600">&#10003;</span>
                  ) : (
                    <span className="text-red-600">&#10007;</span>
                  )}
                </td>
                <td className="px-4 py-3 text-center">
                  {entry.in_api ? (
                    <span className="text-green-600">&#10003;</span>
                  ) : (
                    <span className="text-muted-foreground">&#10007;</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
