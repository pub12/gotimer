# Blog Media Manager

**Date:** 2026-04-24
**Scope:** Admin blog workflow — image uploads, media library, rename with reference rewriting, and unused-file cleanup.

## Problem

The blog editor accepts pasted images (uploaded as UUID-named files under `data/blog-images/`) but has no explicit upload button, no way to pick SEO-friendly filenames, and no way to see, rename, or delete previously uploaded files. Over time this produces an opaque pile of UUID images with no visibility into what is used, what is dead weight, or how to clean it up.

## Goal

Give admins:
1. A one-click file-picker upload directly from the editor toolbar, with a friendly filename chosen at upload time.
2. A `/admin/blog/media` page listing every uploaded blog image with usage info.
3. Safe rename that rewrites references in every post that embeds the file.
4. A bulk "delete all unused" action after a cross-post reference scan.

## Design decisions (confirmed)

- **Rename semantics:** renaming rewrites every post's `content` that references the old path, in a single DB transaction. A failure rolls back both the DB writes and the on-disk rename.
- **Filename collisions:** auto-suffix `-2`, `-3`, … silently. Never overwrite an existing file. Never error on a collision.
- **Cleanup UX:** each media card shows a usage count computed server-side; a "Delete all unused" bulk button at the top removes every server-verified-unused file at once. Filter: All / Used / Unused.

## Architecture

### New files

- `src/lib/blog-image-references.ts` — pure helpers.
- `src/app/api/admin/blog-images/route.ts` — GET list, DELETE bulk-unused.
- `src/app/api/admin/blog-images/[filename]/route.ts` — PATCH rename, DELETE single.
- `src/app/admin/blog/media/page.tsx` — media manager page.
- `src/components/blog/media-upload-dialog.tsx` — shared by toolbar and page.
- `src/components/blog/media-rename-dialog.tsx`.
- `src/components/blog/media-delete-dialog.tsx`.

### Edited files

- `src/app/api/admin/upload-image/route.ts` — accept optional `name` form field; slugify + auto-suffix.
- `src/components/blog/markdown-editor.tsx` — add custom toolbar command wired to the upload dialog.
- `src/components/admin/sidebar.tsx` — add Media nav item under Blog.

## Reference-scanning rules

A single regex delimits references so that `foo.png` does not match `foo.png.bak` or `foo-2.png`:

```
/\/blog-images\/<escaped_filename>(?=[^a-zA-Z0-9._-]|$)/g
```

Used for both:
- Building the usage map (does a post's `content` contain the pattern?).
- Rewriting references (replace all matches with the new path).

All reference forms share the `/blog-images/<filename>` prefix, so one pattern handles:
- Markdown: `![alt](/blog-images/foo.png)`
- HTML/MDX: `<img src="/blog-images/foo.png" />`
- MDX component: `<BlogImage src="/blog-images/foo.png" />`

## API contracts

### `POST /api/admin/upload-image` (extended)

Multipart form fields:
- `file` (required) — PNG/JPEG/WebP, ≤5MB.
- `name` (optional) — friendly basename (extension is derived from file type). If present: slugified, auto-suffixed on collision. If absent: UUID (existing behavior, kept for paste-upload).

Response (201):
```json
{ "path": "/blog-images/pomodoro-hero.png", "filename": "pomodoro-hero.png" }
```

### `GET /api/admin/blog-images`

Lists every file in `data/blog-images/` plus usage map.

Response:
```json
{
  "images": [
    {
      "filename": "pomodoro-hero.png",
      "path": "/blog-images/pomodoro-hero.png",
      "size": 238412,
      "uploaded_at": "2026-04-22T10:14:03.000Z",
      "used_in": [
        { "post_id": "abc", "post_title": "The Complete Guide", "post_slug": "the-complete-guide" }
      ]
    }
  ]
}
```

### `DELETE /api/admin/blog-images?unused=true`

Server recomputes unused set (does not trust client). Deletes each unused file.

Response: `{ "deleted": 7 }`

### `PATCH /api/admin/blog-images/[filename]`

Body: `{ "new_name": "pomodoro-hero-updated" }`

Slugifies, auto-suffixes, renames on disk, rewrites every referencing post's `content` in one transaction.

Response:
```json
{ "path": "/blog-images/pomodoro-hero-updated.png", "filename": "pomodoro-hero-updated.png", "posts_updated": 3 }
```

### `DELETE /api/admin/blog-images/[filename]?confirm=true`

Deletes the file. If file is in use and `confirm` is not `true`, responds 409 with the usage list. Does NOT modify post content; broken references are left intentionally after explicit confirm.

All endpoints require `admin_view_all_games` permission (matches existing upload route).

## Frontend behaviour

### Toolbar upload button

- Custom command added to `MDEditor.commands` placed next to the existing Image button.
- Click → hidden `<input type="file" accept="image/png,image/jpeg,image/webp">` → MediaUploadDialog.
- Dialog shows: preview thumbnail, filename input (default = slugified original name, e.g. `IMG_1234.png` → `img-1234`), file size, Upload/Cancel.
- Upload POSTs multipart `{file, name}` → editor inserts `![](path)` at cursor on success.
- Existing paste-to-upload handler unchanged (uses UUID, no dialog).

### Media manager page `/admin/blog/media`

Layout:
- Top bar: Upload button · filter dropdown (All / Used / Unused) · "Delete all unused" button (disabled when 0 unused).
- Grid of image cards: thumbnail, filename, size, `Used in N posts` badge or `Unused` badge.
- Card click expands usage list (post titles linking to `/admin/blog/<id>`).
- Per-card buttons: Rename, Delete.
- Rename dialog: single text input (pre-filled with current name sans extension), submit → PATCH → toast "Renamed and updated N posts".
- Delete dialog: if used, warns with post list and requires a `confirm` checkbox; if unused, simple OK/Cancel.

### Sidebar

Media entry added in the Blog group, below the Blog link, using the `ImageIcon` from lucide-react.

## Out of scope

- Timer-page images and any non-blog admin uploads.
- Image compression / EXIF stripping.
- Soft-delete or un-delete.
- CDN or S3; storage remains on local disk under `data/blog-images/`.
- Drag-and-drop onto the editor (paste-to-upload already covers the common case).

## Success criteria

- Toolbar Upload button opens file picker, uploads with chosen name, inserts markdown at cursor.
- `/admin/blog/media` lists every file with accurate usage counts and filter.
- Rename moves the file on disk AND rewrites every post that references it, as a single transaction.
- Collisions on upload or rename silently auto-suffix `-2`, `-3`, …
- "Delete all unused" removes only files the server itself verifies as unused.
- Deleting a used file requires explicit confirmation; post content is not touched (broken refs left).
- All endpoints gate on `admin_view_all_games`.
