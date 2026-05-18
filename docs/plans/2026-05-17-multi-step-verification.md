# Multi-Step Strategy Verification — De-Risking the 3-Niche Build

**Date:** 2026-05-17
**Verifier:** code read of `src/lib/timer-strategies/multi-step.ts` (180 lines) + `types.ts`
**Outcome:** GREEN — no strategy changes needed. Pre-expand cycles at config time. One minor enhancement for debate timer.

---

## 1. What I was verifying

The implementation plan flagged one risk: does `multi-step` support the **repeating cycles** the Søberg contrast-therapy protocol needs (e.g., `[sauna, plunge, rest] × 3, end on plunge`)? If not, we'd need a new `cycle.ts` strategy (1-2 extra days).

## 2. What `multi-step` actually is

A flat sequential walker over a `StepDefinition[]`. Each step has `name`, `duration`, and an optional `agitation` hook. The strategy:

- ticks each step down to zero, then advances to the next
- exposes `step_info: { current, total, name }` on the display
- supports `skip_step` action (jumps to next; records remaining time as "skipped")
- supports `acknowledge_agitation` action (resets the agitation interval inside a step)
- emits warnings for tick (last 5s), phase_change, complete, and agitation
- **does NOT** support repeating cycles, "previous step" rewind, or per-step custom sound config

## 3. The verdict per niche

### 3.1 Sauna / cold-plunge — GREEN with pre-expand approach

**Decision: pre-expand cycles into a flat step array at config time. No strategy changes.**

Instead of a `{ cycles, phases }` config shape, the page builds the flat array before passing to `TimerPage`:

```ts
// src/lib/contrast-therapy.ts
type ContrastConfig = {
  phases: { name: string; duration: number }[];   // e.g., [sauna 15m, plunge 2m, rest 1m]
  cycles: number;                                  // e.g., 3
  end_on?: string;                                 // e.g., "Plunge" — drops trailing phases
};

export function expand_contrast(config: ContrastConfig): StepDefinition[] {
  const steps: StepDefinition[] = [];
  for (let r = 1; r <= config.cycles; r++) {
    for (const phase of config.phases) {
      steps.push({
        name: `${phase.name} — Round ${r}/${config.cycles}`,
        duration: phase.duration,
      });
    }
  }
  if (config.end_on) {
    // trim trailing phases after the last occurrence of `end_on` in the final cycle
    const last_keep = steps.map(s => s.name.startsWith(config.end_on!)).lastIndexOf(true);
    return steps.slice(0, last_keep + 1);
  }
  return steps;
}
```

This works because:
- The strategy's `step_info.current` becomes the absolute step index (1-9 for Søberg) — we just compute `round = floor((current) / phases.length) + 1` for display.
- The `phase_label` already includes the round string ("Plunge — Round 2/3") so the existing display renders it correctly.
- `end_on` drops trailing phases — Søberg's "end on cold" becomes a 9-step or 8-step array depending on whether trailing rest matters.

**Effort impact:** 0 days saved vs. the original estimate (we already budgeted for this). Risk eliminated.

**Trade-off:** the URL serialization needs to encode the *original* cycle config, not the expanded steps (otherwise URLs balloon). Page-level shim handles compression/expansion symmetrically.

### 3.2 Debate / Toastmasters — GREEN with one small enhancement

**Decision: use `multi-step` as-is for sequential phases. Add `previous_step` action to the strategy (5-line patch).**

Why the patch: a debate judge sometimes needs to rewind ("wait, let's re-do crossfire"). The current strategy only supports forward `skip_step`. Adding a symmetric `previous_step` is trivial:

```ts
// add to on_action switch in multi-step.ts
case "previous_step": {
  const prev_idx = Math.max(0, state.current_step - 1);
  const prev_step = state.steps[prev_idx];
  return {
    ...state,
    prev_step: state.current_step,
    current_step: prev_idx,
    step_remaining: prev_step.duration,
    step_elapsed: 0,
    agitation_countdown: prev_step.agitation?.initial_seconds || 0,
    agitation_pending: false,
  };
}
```

Test coverage: extend the existing strategy tests with a `previous_step` case.

**Effort impact:** +0.5 day for the patch + test. Manageable.

**Out of scope for v1:** "pause and resume from the same second" inside a step (different from rewinding). The current shell may already handle this via the timer-provider's pause state — verify before scoping additional work.

### 3.3 Classroom toolkit — N/A

These tools are not timers and don't use the strategy system. They are standalone React components. No verification needed.

## 4. What I did NOT verify (and what could still bite us)

- **iOS Safari audio cue unlock** — known issue across all web timers. The existing `tabata/page.tsx` must already handle this; before any of the three niche builds, **read the audio-init code in `timer-provider.tsx` or `timer-page.tsx` and confirm the pattern is reusable**. Budget 0.5 day if it isn't.
- **Wake-lock for 15+ minute phases** — the sauna phase is the longest sustained countdown on the site. If wake-lock isn't already in the shell, scope it once and reuse everywhere. Verify by reading `timer-shell-v2.tsx`.
- **Projection-mode CSS at 1920x1080** — the debate stoplight needs to be readable across a classroom. No way to verify without building; mitigate by testing on a real projector/Chromebook in week 2.
- **Strategy tick interval** — the comment in `types.ts` says "Advance state by one tick (1 second)". For debate timers with sub-second yellow/red warnings (e.g., warning at 0:30.5 remaining), 1-second granularity is fine. For Søberg, also fine. Confirmed not a blocker.

## 5. Implementation plan amendment

Update the implementation plan (`2026-05-17-three-niche-implementation.md`) sections:

- §3.2 (sauna strategy) — replace "extend `multi-step` if needed" with "pre-expand cycles via a `expand_contrast()` shim; no strategy changes."
- §4.2 (debate strategy) — add "+0.5 day to add `previous_step` action to `multi-step` strategy."
- §6.2 (things to verify before starting) — strike item 1 (multi-step verification — done). Add: "Read `timer-provider.tsx` / `timer-shell-v2.tsx` to confirm iOS audio unlock and wake-lock patterns. Reuse, don't reimplement."
- §6.1 (shared shipping checklist) — wake-lock already on the list; iOS audio cues already on the list. No changes needed.

I will apply these edits to the implementation plan in a separate edit.

## 6. Net effort delta

| Niche | Original estimate | After verification | Delta |
|---|---|---|---|
| Sauna/cold-plunge | 4-5 days | 4-5 days | 0 |
| Debate/Toastmasters | 7-8 days | 7.5-8.5 days | +0.5 |
| Classroom toolkit | 9-10 days | 9-10 days | 0 |
| **Total** | **20-23 days** | **20.5-23.5 days** | **+0.5** |

Risk de-risked at minimal cost.
