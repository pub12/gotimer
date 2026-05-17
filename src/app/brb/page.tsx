"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { BrbOverlay } from "@/components/brb/overlay";
import { BrbLanding } from "@/components/brb/landing";

function Content() {
  const params = useSearchParams();
  if (params.get("embed") === "1") {
    return <BrbOverlay />;
  }
  return <BrbLanding />;
}

export default function Page() {
  return (
    <Suspense fallback={null}>
      <Content />
    </Suspense>
  );
}
