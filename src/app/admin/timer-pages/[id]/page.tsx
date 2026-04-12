"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import TimerPageForm from "@/components/admin/timer-page-form";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

type TimerPageData = {
  id: string;
  slug: string;
  title: string;
  timer_type: string;
  intro_html: string;
  faq_json: string;
  meta_title: string;
  meta_description: string;
  timer_config_json: string;
  character_id: string | null;
  status: string;
};

export default function AdminTimerPageEditPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [page_data, set_page_data] = useState<TimerPageData | null>(null);
  const [loading, set_loading] = useState(true);
  const [error, set_error] = useState<string | null>(null);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) router.push("/");
  }, [auth_loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok || !id) return;

    fetch(`/api/admin/timer-pages/${id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => set_page_data(data))
      .catch((err) => set_error(err.message))
      .finally(() => set_loading(false));
  }, [auth_loading, authenticated, permission_ok, id]);

  if (auth_loading || loading) {
    return (
      <main className="p-8">
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!authenticated || !permission_ok) return null;

  if (error || !page_data) {
    return (
      <main className="p-8">
        <p className="text-red-600">{error ?? "Timer page not found"}</p>
      </main>
    );
  }

  return (
    <main className="p-6 md:p-8 max-w-3xl">
      <h1 className="text-2xl font-headline font-black text-foreground mb-6">Edit Timer Page</h1>
      <TimerPageForm mode="edit" initial_data={page_data} />
    </main>
  );
}
