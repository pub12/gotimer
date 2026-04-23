"use client";

import React from "react";

interface Props {
  message?: string;
  expired_message?: string;
  is_complete: boolean;
}

/**
 * Renders a message above the timer. Uses `expired_message` when the timer has
 * completed, otherwise `message`. Both are plain text — no HTML injection.
 */
export function EmbedMessage({ message, expired_message, is_complete }: Props) {
  const text = is_complete && expired_message ? expired_message : message;
  if (!text) return null;
  return (
    <div
      className="text-center text-lg md:text-xl font-medium mb-3 max-w-2xl"
      data-testid="embed-message"
    >
      {text}
    </div>
  );
}
