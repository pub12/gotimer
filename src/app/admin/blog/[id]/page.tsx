"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { PostForm } from "@/components/blog/post-form";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

interface FaqItem {
  question: string;
  answer: string;
}

interface ApiPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string | null;
  meta_title: string | null;
  meta_description: string | null;
  faq_json: string | null;
  publish_date: string | null;
  status: string;
}

export default function AdminBlogEditPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const { authenticated, permission_ok, loading: auth_loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  const [post, set_post] = useState<ApiPost | null>(null);
  const [loading, set_loading] = useState(true);
  const [not_found, set_not_found] = useState(false);

  useEffect(() => {
    if (!auth_loading && (!authenticated || !permission_ok)) router.push("/");
  }, [auth_loading, authenticated, permission_ok, router]);

  useEffect(() => {
    if (auth_loading || !authenticated || !permission_ok) return;

    fetch(`/api/admin/blog/${id}`)
      .then((res) => {
        if (res.status === 404) {
          set_not_found(true);
          return null;
        }
        return res.json() as Promise<ApiPost>;
      })
      .then((data) => {
        if (data) set_post(data);
      })
      .catch(() => set_not_found(true))
      .finally(() => set_loading(false));
  }, [auth_loading, authenticated, permission_ok, id]);

  if (auth_loading || loading) {
    return <main className="p-8"><p className="text-muted-foreground">Loading...</p></main>;
  }

  if (!authenticated || !permission_ok) return null;

  if (not_found || !post) {
    return (
      <main className="p-8">
        <p className="text-red-500">Post not found.</p>
      </main>
    );
  }

  // Parse faq_json into items array
  let faq_items: FaqItem[] = [];
  if (post.faq_json) {
    try {
      const parsed = JSON.parse(post.faq_json);
      if (Array.isArray(parsed)) faq_items = parsed;
    } catch {
      // ignore
    }
  }

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-headline font-black text-foreground">Edit Post</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Status: <span className="font-medium capitalize">{post.status}</span>
        </p>
      </div>
      <PostForm
        post_id={post.id}
        initial={{
          title: post.title,
          slug: post.slug,
          content: post.content,
          category_id: post.category_id ?? "",
          meta_title: post.meta_title ?? "",
          meta_description: post.meta_description ?? "",
          faq_items,
          publish_date: post.publish_date
            ? new Date(post.publish_date).toISOString().slice(0, 16)
            : "",
        }}
      />
    </main>
  );
}
