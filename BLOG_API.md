# GoTimer Blog Management API

Base URL: `https://gotimer.org` (production) or `http://localhost:3000` (dev)

All endpoints require a Bearer token:
```
Authorization: Bearer $BLOG_API_KEY
```

---

## Endpoints

### GET /api/blog/manage — List all posts

Returns all blog posts (including drafts) with full field data.

**Query parameters:**
| Param | Values | Default | Description |
|-------|--------|---------|-------------|
| `fields` | `minimal` | _(full)_ | Return only id, slug, title, status, publish_date, category_id, created_at, updated_at |

**Response:**
```json
{
  "posts": [
    {
      "id": "uuid",
      "slug": "time-blindness-adhd-timers",
      "title": "What Is Time Blindness?",
      "content": "Full MDX content...",
      "category_id": "uuid",
      "meta_title": "Time Blindness & ADHD",
      "meta_description": "Time blindness makes...",
      "character_id": "uuid",
      "faq_json": "[{\"question\":\"...\",\"answer\":\"...\"}]",
      "status": "published",
      "publish_date": "2026-04-12T06:41:50.308Z",
      "created_at": "2026-04-12T06:41:50.308Z",
      "updated_at": "2026-04-16T00:08:39.654Z",
      "category_name": "ADHD & Focus",
      "category_slug": "adhd-focus"
    }
  ],
  "categories": [
    {
      "id": "uuid",
      "slug": "adhd-focus",
      "name": "ADHD & Focus",
      "description": "",
      "colour": "#6366f1"
    }
  ]
}
```

---

### GET /api/blog/manage/:slug — Get single post

Returns a single post with all fields. `faq_json` is returned as a parsed JSON array (not a string).

**Response (200):**
```json
{
  "post": {
    "id": "uuid",
    "slug": "time-blindness-adhd-timers",
    "title": "What Is Time Blindness?",
    "content": "Full MDX content...",
    "category_id": "uuid",
    "meta_title": "Time Blindness & ADHD",
    "meta_description": "...",
    "character_id": "uuid",
    "faq_json": [{ "question": "What is time blindness?", "answer": "..." }],
    "status": "published",
    "publish_date": "2026-04-12T06:41:50.308Z",
    "created_at": "2026-04-12T06:41:50.308Z",
    "updated_at": "2026-04-16T00:08:39.654Z",
    "category_name": "ADHD & Focus",
    "category_slug": "adhd-focus"
  }
}
```

**Response (404):**
```json
{ "error": "Post not found" }
```

---

### POST /api/blog/manage — Create or full-update a post (upsert)

Creates a new post or **fully replaces** an existing post matched by `slug`. Any field not included will be set to its default (empty string or null).

> **Warning:** This is a destructive full-replace operation. To update individual fields without touching the rest, use PATCH instead.

**Required fields:** `slug`, `title`, `content`

**Request body:**
```json
{
  "slug": "my-article-slug",
  "title": "Article Title",
  "content": "Full MDX content here...",
  "category_id": "uuid (optional — or use category_name)",
  "category_name": "Productivity (optional — auto-creates category if not found)",
  "meta_title": "SEO Title (optional)",
  "meta_description": "SEO description (optional)",
  "character_id": "uuid (optional — from GET /api/blog/characters)",
  "faq_json": [{ "question": "...", "answer": "..." }],
  "status": "published or draft (default: draft)"
}

```

**Notes:**
- `faq_json` accepts either a JSON string or a JSON array
- If `category_name` is provided without `category_id`, the category is auto-created if it doesn't exist
- `publish_date` is auto-set when `status` is `"published"`
- If a post with the same `slug` exists, it is **fully replaced** (all fields overwritten)

**Response (201 created / 200 updated):**
```json
{
  "success": true,
  "action": "created",
  "post": { "...all fields..." }
}
```

---

### PATCH /api/blog/manage — Partial update a post

Updates only the specified fields on an existing post. All other fields are left untouched.

**Required:** `slug` (used as lookup key, not updatable)

**Optional fields (include only what you want to change):**
- `title` — Post title
- `content` — Full MDX content
- `category_id` — Category UUID
- `category_name` — Category name (auto-creates if needed, used when category_id not provided)
- `meta_title` — SEO title
- `meta_description` — SEO description
- `character_id` — Character UUID (from GET /api/blog/characters)
- `faq_json` — FAQ array or JSON string
- `status` — `"published"` or `"draft"`

**Examples:**

Update only the character:
```json
{ "slug": "time-blindness-adhd-timers", "character_id": "96bfe1fe-..." }
```

Update only meta fields:
```json
{ "slug": "tabata-timer", "meta_title": "New Title", "meta_description": "New desc" }
```

Publish without touching content:
```json
{ "slug": "my-draft", "status": "published" }
```

**Response (200):**
```json
{
  "success": true,
  "action": "updated",
  "post": {
    "...all fields including category_name and category_slug..."
  }
}
```

**Response (404):** `{ "error": "Post not found" }`
**Response (400):** `{ "error": "No fields to update" }` (when body contains only `slug`)

---

### GET /api/blog/characters — List available characters

Returns all characters available for assignment to blog posts via `character_id`.

**Response:**
```json
{
  "characters": [
    {
      "id": "96bfe1fe-3703-41af-b866-7e2f976b5f4f",
      "character_name": "Drake",
      "file_path": "/mascots/drake-searching.png",
      "scene_description": "The Rugged Explorer searching"
    },
    {
      "id": "uuid",
      "character_name": "Prof",
      "file_path": "/mascots/prof-studying.png",
      "scene_description": "The Ancient Scholar studying"
    }
  ]
}
```

---

### POST /api/blog/images — Upload a blog image

Downloads an image from a URL and stores it locally for use in blog posts via `<BlogImage>` MDX component.

**Request body:**
```json
{
  "image_url": "https://example.com/image.png",
  "filename": "prof-egg-timer.png (optional — auto-generated UUID if omitted)",
  "alt": "Description of the image (optional)"
}
```

**Constraints:**
- Allowed types: PNG, JPEG, WebP
- Max size: 5 MB
- `filename` is sanitized (only alphanumeric, dots, hyphens, underscores kept)

**Response (201):**
```json
{
  "success": true,
  "path": "/blog-images/prof-egg-timer.png",
  "alt": "Description of the image"
}
```

After uploading, use the image in MDX content:
```mdx
<BlogImage src="/blog-images/prof-egg-timer.png" alt="Prof holding an egg timer" />
```

---

## Common Workflows

### Safe single-field update (recommended)
```bash
# Update only the character — content, meta, FAQ, status all preserved
curl -X PATCH /api/blog/manage \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-post", "character_id": "uuid-here"}'
```

### Read-before-write pattern
```bash
# 1. Read current state
curl /api/blog/manage/my-post -H "Authorization: Bearer $BLOG_API_KEY"

# 2. Update only what changed
curl -X PATCH /api/blog/manage \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"slug": "my-post", "meta_title": "Updated Title"}'
```

### Create a new post with character and image
```bash
# 1. Check available characters
curl /api/blog/characters -H "Authorization: Bearer $BLOG_API_KEY"

# 2. Upload an image for the article
curl -X POST /api/blog/images \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"image_url": "https://ai-generated.example/hero.png", "filename": "my-post-hero.png"}'

# 3. Create the post (use the character_id from step 1, image path from step 2 in MDX content)
curl -X POST /api/blog/manage \
  -H "Authorization: Bearer $BLOG_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "slug": "my-new-post",
    "title": "My New Post",
    "content": "# Hello\n\n<BlogImage src=\"/blog-images/my-post-hero.png\" alt=\"Hero\" />\n\nArticle content...",
    "character_id": "uuid-from-step-1",
    "category_name": "Productivity",
    "status": "published"
  }'
```

---

## Field Reference

| Field | Type | POST Required | PATCH Updatable | Notes |
|-------|------|:---:|:---:|-------|
| `slug` | string | Yes | Lookup key | URL-safe identifier, must be unique |
| `title` | string | Yes | Yes | |
| `content` | string | Yes | Yes | MDX format, supports `<BlogImage>`, `<YouTube>`, `<Callout>`, `<TimerEmbed>` |
| `category_id` | string | No | Yes | UUID from categories list |
| `category_name` | string | No | Yes (resolves to category_id) | Auto-creates category if not found |
| `meta_title` | string | No | Yes | SEO title |
| `meta_description` | string | No | Yes | SEO description |
| `character_id` | string | No | Yes | UUID from GET /api/blog/characters |
| `faq_json` | array or string | No | Yes | Array of `{question, answer}` objects |
| `status` | string | No | Yes | `"published"` or `"draft"` |
| `publish_date` | string | Auto | Auto | Set automatically when status becomes published |

## MDX Components Available in Content

- `<BlogImage src="/blog-images/file.png" alt="..." caption="Optional caption" />` — Responsive image with optional figure caption
- `<YouTube id="dQw4w9WgXcQ" title="Video title" start={30} />` — YouTube embed
- `<Callout type="info|warning|tip">Text</Callout>` — Alert/callout box
- `<TimerEmbed />` — Embedded GoTimer widget
- `<CodeBlock language="html">...</CodeBlock>` — Styled code panel with language label and one-click copy button (see below)

### Code Blocks

Standard markdown triple-backtick fences are rendered as a styled code panel automatically — no MDX component needed. The panel includes a language label (from the fence hint) and a "Copy" button that briefly flips to "Copied ✓".

````md
```html
<iframe src="https://gotimer.org/embed/pomodoro" width="400" height="500"></iframe>
```
````

- The fence language (e.g. ```` ```html ````, ```` ```bash ````, ```` ```json ````) appears as a label in the top-left of the panel. Omit it and the label is simply blank.
- Long lines scroll horizontally — code is never wrapped.
- For explicit control inside MDX content, use `<CodeBlock language="html">...</CodeBlock>` directly. This is rarely needed since fences upgrade automatically.

### Inline Code

Single-backtick text renders as an inline code pill — monospace, tinted background, small rounded corners, non-wrapping. Use it for parameter names, short values, filenames, or any technical term that should stand out from prose.

```md
Set `theme=dark` and `duration=300` in the embed URL to customise the widget.
```

Works inside paragraphs, list items, headings, callouts, and table cells.

### Tables

GitHub Flavoured Markdown pipe tables are supported and render as a styled `<table>` (bordered container, bold header row, horizontal scroll on narrow screens).

```md
| Param      | Type   | Default | Description                |
| ---------- | ------ | ------- | -------------------------- |
| `theme`    | string | `light` | Widget theme               |
| `duration` | number | `300`   | Countdown duration seconds |
```

No MDX component needed — the table syntax upgrades automatically.
