import { describe, expect, test } from "vitest";
import {
  build_usage_map,
  is_referenced,
  rewrite_references,
  type BlogPostRow,
} from "./blog-image-references";

function post(id: string, content: string): BlogPostRow {
  return { id, title: `Post ${id}`, slug: `post-${id}`, content };
}

describe("is_referenced", () => {
  test("matches markdown image syntax", () => {
    expect(is_referenced("hello ![a](/blog-images/foo.png) world", "foo.png")).toBe(true);
  });

  test("matches img tag", () => {
    expect(is_referenced(`<img src="/blog-images/foo.png" />`, "foo.png")).toBe(true);
  });

  test("matches BlogImage component", () => {
    expect(is_referenced(`<BlogImage src="/blog-images/foo.png" />`, "foo.png")).toBe(true);
  });

  test("does NOT match when filename is only a substring", () => {
    expect(is_referenced("see /blog-images/foo.png.bak", "foo.png")).toBe(false);
    expect(is_referenced("see /blog-images/foo-extra.png", "foo.png")).toBe(false);
  });

  test("matches at end of content (no trailing delimiter)", () => {
    expect(is_referenced("/blog-images/foo.png", "foo.png")).toBe(true);
  });

  test("handles filenames with dashes and digits", () => {
    expect(
      is_referenced("![](/blog-images/pomodoro-hero-2.png)", "pomodoro-hero-2.png")
    ).toBe(true);
    expect(
      is_referenced("![](/blog-images/pomodoro-hero-2.png)", "pomodoro-hero.png")
    ).toBe(false);
  });
});

describe("build_usage_map", () => {
  test("maps every filename to its referencing posts", () => {
    const posts = [
      post("a", "uses ![](/blog-images/one.png)"),
      post("b", "uses /blog-images/two.png and /blog-images/one.png"),
      post("c", "nothing here"),
    ];
    const map = build_usage_map(posts, ["one.png", "two.png", "three.png"]);
    expect(map.get("one.png")?.map((u) => u.post_id).sort()).toEqual(["a", "b"]);
    expect(map.get("two.png")?.map((u) => u.post_id)).toEqual(["b"]);
    expect(map.get("three.png")).toEqual([]);
  });

  test("always includes every requested filename in the result, even if unused", () => {
    const map = build_usage_map([post("a", "")], ["missing.png"]);
    expect(map.has("missing.png")).toBe(true);
    expect(map.get("missing.png")).toEqual([]);
  });

  test("does NOT double-count a post that mentions the same file twice", () => {
    const posts = [post("a", "/blog-images/x.png and /blog-images/x.png")];
    const map = build_usage_map(posts, ["x.png"]);
    expect(map.get("x.png")?.length).toBe(1);
  });
});

describe("rewrite_references", () => {
  test("rewrites every occurrence", () => {
    const input = "![](/blog-images/old.png) and <img src=\"/blog-images/old.png\" />";
    const out = rewrite_references(input, "old.png", "new.png");
    expect(out).toBe(
      `![](/blog-images/new.png) and <img src="/blog-images/new.png" />`
    );
  });

  test("does NOT touch substring collisions", () => {
    const input = "/blog-images/foo.png.bak and /blog-images/foo-extra.png";
    const out = rewrite_references(input, "foo.png", "renamed.png");
    expect(out).toBe(input);
  });

  test("handles end-of-string reference", () => {
    expect(rewrite_references("see /blog-images/foo.png", "foo.png", "bar.png")).toBe(
      "see /blog-images/bar.png"
    );
  });
});
