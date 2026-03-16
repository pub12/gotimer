"use client";

import { useEffect } from "react";
import { fire_sign_up_event } from "@/lib/ga-events";

export function SignUpEvent() {
  useEffect(() => {
    fire_sign_up_event("email");
  }, []);

  return null;
}
