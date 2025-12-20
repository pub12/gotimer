// Purpose: Shared Footer component for the Game Timer app. Displays a simple footer and can be extended in the future.

import React from "react";

/**
 * footer component for the Game Timer app. Displays copyright and can be extended.
 */
export default function Footer() {
  return (
    <footer className="w-full text-center py-4 text-gray-400 text-sm mt-8">
      &copy; {new Date().getFullYear()} Game Timer
    </footer>
  );
} 