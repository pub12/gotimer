"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function GameShareRedirect() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    router.replace(`/public-challenges/${id}`);
  }, [id, router]);

  return (
    <main className="min-h-screen flex items-center justify-center">
      <p className="text-muted-foreground">Redirecting...</p>
    </main>
  );
}
