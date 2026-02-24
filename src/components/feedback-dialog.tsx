"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Send } from "lucide-react";

type FeedbackDialogProps = {
  on_close: () => void;
};

export function FeedbackDialog({ on_close }: FeedbackDialogProps) {
  const [subject, set_subject] = useState("");
  const [message, set_message] = useState("");
  const [sending, set_sending] = useState(false);

  const handle_submit = async () => {
    if (!subject.trim() || !message.trim()) return;
    set_sending(true);

    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: subject.trim(),
          message: message.trim(),
        }),
      });

      if (res.ok) {
        toast.success("Feedback sent! Thank you.");
        on_close();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to send feedback");
      }
    } catch {
      toast.error("Failed to send feedback");
    } finally {
      set_sending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Send Feedback</h3>
            <Button variant="ghost" size="icon" onClick={on_close}>
              <X className="w-4 h-4" />
            </Button>
          </div>

          <p className="text-sm text-muted-foreground mb-4">
            Found a bug? Have a suggestion? Let us know!
          </p>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => set_subject(e.target.value)}
                placeholder="e.g., Bug report, Feature request..."
                maxLength={200}
                className="w-full p-3 border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-1.5 block">
                Message
              </label>
              <textarea
                value={message}
                onChange={(e) => set_message(e.target.value)}
                placeholder="Tell us what's on your mind..."
                maxLength={5000}
                rows={5}
                className="w-full p-3 border rounded-lg text-sm bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <div className="text-xs text-muted-foreground mt-1 text-right">
                {message.length}/5000
              </div>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={on_close}>
              Cancel
            </Button>
            <Button
              className="flex-1"
              disabled={!subject.trim() || !message.trim() || sending}
              onClick={handle_submit}
            >
              {sending ? (
                "Sending..."
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Send
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
