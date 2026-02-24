"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import { use_auth_status } from "hazo_auth/client";
import { Trophy, LogIn } from "lucide-react";

type InvitationData = {
  challenge_name: string;
  challenge_description: string;
  challenge_status: string;
  status: string;
  participant_count: number;
};

export default function AcceptInvitePage() {
  const router = useRouter();
  const { token } = useParams<{ token: string }>();
  const { authenticated, loading: auth_loading } = use_auth_status();
  const [invitation, set_invitation] = useState<InvitationData | null>(null);
  const [loading, set_loading] = useState(true);
  const [accepting, set_accepting] = useState(false);
  const [error, set_error] = useState("");

  useEffect(() => {
    fetch(`/api/challenges/invite/${token}`)
      .then((res) => {
        if (!res.ok) throw new Error("Invalid invitation");
        return res.json();
      })
      .then((data) => set_invitation(data))
      .catch(() => set_error("This invitation link is invalid or has expired."))
      .finally(() => set_loading(false));
  }, [token]);

  const handle_accept = async () => {
    set_accepting(true);
    try {
      const res = await fetch(`/api/challenges/invite/${token}`, {
        method: "POST",
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/challenges/${data.challenge_id}`);
      } else {
        const err = await res.json();
        set_error(err.error || "Failed to accept invitation");
      }
    } finally {
      set_accepting(false);
    }
  };

  if (loading || auth_loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Navbar />
        <p className="text-muted-foreground">Loading...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background p-4 pt-20">
      <Navbar />

      <div className="w-full max-w-md mx-auto">
        {error ? (
          <div className="bg-card rounded-xl p-8 shadow-sm border text-center">
            <p className="text-destructive mb-4">{error}</p>
            <Button onClick={() => router.push("/challenges")}>
              Go to Challenges
            </Button>
          </div>
        ) : invitation ? (
          <div className="bg-card rounded-xl p-8 shadow-sm border text-center">
            <Trophy className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">
              You&apos;ve Been Challenged!
            </h1>
            <h2 className="text-xl font-semibold text-primary mb-2">
              {invitation.challenge_name}
            </h2>
            {invitation.challenge_description && (
              <p className="text-muted-foreground mb-6">
                {invitation.challenge_description}
              </p>
            )}

            {authenticated ? (
              <Button
                className="w-full"
                onClick={handle_accept}
                disabled={accepting}
              >
                {accepting ? "Joining..." : "Accept Challenge"}
              </Button>
            ) : (
              <div>
                <p className="text-muted-foreground mb-4">
                  Sign in to accept this challenge
                </p>
                <Button
                  className="w-full"
                  onClick={() => {
                    localStorage.setItem("redirect_after_login", `/challenges/invite/${token}`);
                    router.push("/hazo_auth/login");
                  }}
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Login with Google
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </main>
  );
}
