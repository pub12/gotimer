import { YouTube } from "./youtube";
import { BlogImage } from "./blog-image";
import { Callout } from "./callout";
import { TimerEmbed } from "./timer-embed";
import { CodeBlock } from "./code-block";

export { YouTube, BlogImage, Callout, TimerEmbed, CodeBlock };

export const mdxComponents = {
  YouTube,
  BlogImage,
  Callout,
  TimerEmbed,
  CodeBlock,
  pre: CodeBlock,
};
