"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/navbar";
import { use_hazo_auth } from "hazo_auth/client";
import { UserManagementLayout } from "hazo_auth/components/layouts/user_management";

const REQUIRED_PERMISSIONS: string[] = ["admin_user_management"];

export default function AdminUserManagementPage() {
  const router = useRouter();
  const { authenticated, permission_ok, loading } = use_hazo_auth({
    required_permissions: REQUIRED_PERMISSIONS,
  });

  useEffect(() => {
    if (!loading && (!authenticated || !permission_ok)) {
      router.push("/");
    }
  }, [loading, authenticated, permission_ok, router]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  if (!authenticated || !permission_ok) return null;

  return (
    <main className="min-h-screen flex flex-col items-center bg-background p-4 pt-20">
      <Navbar />
      <div className="w-full max-w-6xl mx-auto">
        <UserManagementLayout />
      </div>
    </main>
  );
}
