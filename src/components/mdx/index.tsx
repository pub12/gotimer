import type { HTMLAttributes } from "react";
import { YouTube } from "./youtube";
import { BlogImage } from "./blog-image";
import { Callout } from "./callout";
import { TimerEmbed } from "./timer-embed";
import { CodeBlock } from "./code-block";

export { YouTube, BlogImage, Callout, TimerEmbed, CodeBlock };

// Inline `code` — fenced code (with a language-* className) is delegated to CodeBlock via the `pre` override;
// here we only style bare inline backticks.
function InlineCode({ className, children, ...props }: HTMLAttributes<HTMLElement>) {
  if (className) {
    return <code className={className} {...props}>{children}</code>;
  }
  return (
    <code
      className="whitespace-nowrap rounded bg-surface-container px-1.5 py-0.5 font-mono text-[0.875em] text-on-surface"
      {...props}
    >
      {children}
    </code>
  );
}

function Table({ children, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="my-6 overflow-x-auto rounded-xl border border-surface-container-high">
      <table className="w-full border-collapse text-left text-sm" {...props}>
        {children}
      </table>
    </div>
  );
}

function Th({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className="border-b border-surface-container-high bg-surface-container-low px-4 py-3 font-headline font-bold text-on-surface"
      {...props}
    >
      {children}
    </th>
  );
}

function Td({ children, ...props }: HTMLAttributes<HTMLTableCellElement>) {
  return (
    <td className="border-b border-surface-container-high px-4 py-3" {...props}>
      {children}
    </td>
  );
}

export const mdxComponents = {
  YouTube,
  BlogImage,
  Callout,
  TimerEmbed,
  CodeBlock,
  pre: CodeBlock,
  code: InlineCode,
  table: Table,
  th: Th,
  td: Td,
};
