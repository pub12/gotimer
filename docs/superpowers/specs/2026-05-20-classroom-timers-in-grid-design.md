# Classroom Timers in Grid — Design Spec

**Date:** 2026-05-20
**Status:** Approved

## Goal

Add classroom-relevant timer pages to the existing tool grid on `/classroom`, making the section all-encompassing. No changes to the page title, subtitle, callout box, prose, FAQ, or metadata.

## Scope

Single file change: `src/app/classroom/page.tsx`.

## What Changes

### TOOLS array

Five new entries appended after the existing four:

| Position | Name | URL | Emoji | Description |
|---|---|---|---|---|
| 5 | Classroom Timer | `/productivity/classroom` | ⏱️ | Large-display projectable countdown. Smartboard-ready — great for transitions, tests, and timed activities. |
| 6 | Study Timer | `/productivity/study` | 📚 | Pomodoro-style focus sessions. Structured work/break cycles for independent study periods. |
| 7 | Debate Timer | `/productivity/debate-timer` | 🗣️ | Multi-phase debate round timer. Supports PF, LD, Policy, WSDC, and British Parliamentary formats. |
| 8 | Presentation Timer | `/productivity/presentation` | 📊 | Count down student presentations. Full-screen display with configurable time limit. |
| 9 | Breathing Timer | `/wellness/breathing` | 🫁 | Guided breathing for classroom brain breaks. Calm the room between activities. |

### Structured data

`itemListLd` is built from the `TOOLS` array — no separate change needed; it picks up the new entries automatically if `build_classroom_itemlist_ld` iterates the passed array.

## What Does NOT Change

- Page title: "Free Classroom Tools for Teachers"
- Subtitle: "Four browser-based tools that just work…" (left as-is even though the count is stale)
- Callout box ("Looking for a classroom timer? Try the projectable countdown timer…")
- Prose section
- FAQ section
- SEO metadata
- `webAppLd` structured data

## Success Criteria

- All 9 cards render in the 2-column grid at `/classroom`
- Each timer card links to the correct URL
- Existing 4 tool cards are unchanged
- `npx tsc --noEmit` passes
