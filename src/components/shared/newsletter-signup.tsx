"use client";

import React, { useState } from "react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function NewsletterSignup({
  title = "Stay in the Loop",
  subtitle,
  onSubmit,
  className,
}: {
  title?: string;
  subtitle?: string;
  onSubmit?: (email: string) => void;
  className?: string;
}) {
  const [email, set_email] = useState("");

  function handle_submit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim() && onSubmit) {
      onSubmit(email.trim());
      set_email("");
    }
  }

  return (
    <div
      data-slot="newsletter-signup"
      className={cn(
        "bg-primary text-primary-foreground rounded-[1.5rem] p-8",
        className
      )}
    >
      <h3 className="font-headline font-black text-2xl">{title}</h3>
      {subtitle && (
        <p className="text-primary-foreground/70 mt-2">{subtitle}</p>
      )}
      <form onSubmit={handle_submit} className="flex gap-3 mt-4">
        <input
          type="email"
          value={email}
          onChange={(e) => set_email(e.target.value)}
          placeholder="Enter your email"
          className="flex-1 bg-white/10 text-primary-foreground placeholder:text-primary-foreground/50 rounded-[0.75rem] px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-secondary"
          required
        />
        <Button type="submit" variant="secondary">
          Subscribe
        </Button>
      </form>
    </div>
  );
}
