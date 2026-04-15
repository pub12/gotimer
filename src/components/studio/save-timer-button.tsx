"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Bookmark } from "lucide-react";
import { SaveTimerDialog } from "./save-timer-dialog";

type SaveTimerButtonProps = {
  timer_type: string;
  title: string;
  config: Record<string, unknown>;
};

export function SaveTimerButton({ timer_type, title, config }: SaveTimerButtonProps) {
  const [open, set_open] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => set_open(true)}
        title="Save to Studio"
      >
        <Bookmark className="w-4 h-4" />
      </Button>

      <SaveTimerDialog
        open={open}
        on_close={() => set_open(false)}
        timer_type={timer_type}
        default_title={title}
        config={config}
      />
    </>
  );
}
