"use client";

import { useRef, useState, type ReactElement, type ReactNode } from "react";

interface CodeBlockProps {
  language?: string;
  children?: ReactNode;
  className?: string;
}

function extract_text(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extract_text).join("");
  if (typeof node === "object" && "props" in node) {
    const element = node as ReactElement<{ children?: ReactNode }>;
    return extract_text(element.props?.children);
  }
  return "";
}

function resolve_language(explicit: string | undefined, children: ReactNode): string | null {
  if (explicit) return explicit;
  if (children && typeof children === "object" && "props" in children) {
    const element = children as ReactElement<{ className?: string }>;
    const match = element.props?.className?.match(/language-(\S+)/);
    if (match) return match[1];
  }
  return null;
}

export function CodeBlock({ language, children, className }: CodeBlockProps) {
  const [copied, set_copied] = useState(false);
  const pre_ref = useRef<HTMLPreElement>(null);
  const resolved_language = resolve_language(language, children);

  const copy = async () => {
    const text = pre_ref.current?.innerText ?? extract_text(children);
    try {
      await navigator.clipboard.writeText(text);
      set_copied(true);
      setTimeout(() => set_copied(false), 2000);
    } catch {
      // clipboard blocked — silent fail, keep button idle
    }
  };

  return (
    <div className="relative my-6 overflow-hidden rounded-xl border border-primary/20 bg-primary text-primary-foreground shadow-sm">
      <div className="flex items-center justify-between border-b border-primary-foreground/10 px-4 py-1.5">
        <span className="font-mono text-xs uppercase tracking-wide text-primary-foreground/50">
          {resolved_language ?? ""}
        </span>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? "Copied" : "Copy code"}
          className="rounded-md px-2 py-1 font-mono text-xs text-primary-foreground/60 transition hover:bg-primary-foreground/10 hover:text-primary-foreground"
        >
          {copied ? "Copied ✓" : "Copy"}
        </button>
      </div>
      <pre
        ref={pre_ref}
        className={`overflow-x-auto px-4 py-4 text-sm leading-relaxed font-mono ${className ?? ""}`}
      >
        {children}
      </pre>
    </div>
  );
}
