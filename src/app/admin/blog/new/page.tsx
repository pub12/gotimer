"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { use_hazo_auth } from "hazo_auth/client";
import { PostForm } from "@/components/blog/post-form";

const REQUIRED_PERMISSIONS = ["admin_view_all_games"];

export default function AdminBlogNewPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) router.push("/");
  }, [loading, authenticated, permission_ok, router]);

  if (loading) return <main className="p-8"><p className="text-muted-foreground">Loading...</p></main>;
  if (!authenticated || !permission_ok) return null;

  return (
    <main className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-headline font-black text-foreground">New Blog Post</h1>
      </div>
      <PostForm />
    </main>
  );
}
