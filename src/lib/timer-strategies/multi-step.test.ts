import { describe, it, expect } from "vitest";
import { multiStepStrategy } from "./multi-step";

const three_step_config = {
  steps: [
    { name: "Step 1", duration: 60 },
    { name: "Step 2", duration: 90 },
    { name: "Step 3", duration: 30 },
  ],
};

describe("multiStepStrategy: previous_step", () => {
  it("is a no-op at step 0", () => {
    const s = multiStepStrategy.initial_state(three_step_config);
    const next = multiStepStrategy.on_action!(s, "previous_step");
    expect(next.current_step).toBe(0);
    expect(next.step_remaining).toBe(60);
  });

  it("rewinds from step 1 back to step 0 and resets remaining", () => {
    const s = multiStepStrategy.initial_state(three_step_config);
    const skipped = multiStepStrategy.on_action!(s, "skip_step");
    expect(skipped.current_step).toBe(1);
    const rewound = multiStepStrategy.on_action!(skipped, "previous_step");
    expect(rewound.current_step).toBe(0);
    expect(rewound.step_remaining).toBe(60);
    expect(rewound.step_elapsed).toBe(0);
  });

  it("clears the skipped-times mark on the step it rewinds to", () => {
    const s = multiStepStrategy.initial_state(three_step_config);
    const after_skip_one = multiStepStrategy.on_action!(s, "skip_step");
    const after_skip_two = multiStepStrategy.on_action!(
      after_skip_one,
      "skip_step",
    );
    expect(after_skip_two.current_step).toBe(2);
    expect(after_skip_two.skipped_times[0]).toBeDefined();
    expect(after_skip_two.skipped_times[1]).toBeDefined();
    const rewound = multiStepStrategy.on_action!(
      after_skip_two,
      "previous_step",
    );
    expect(rewound.current_step).toBe(1);
    expect(rewound.skipped_times[1]).toBeUndefined();
    expect(rewound.skipped_times[0]).toBeDefined();
  });

  it("un-finishes when rewinding from a finished state", () => {
    const s = multiStepStrategy.initial_state(three_step_config);
    const a = multiStepStrategy.on_action!(s, "skip_step");
    const b = multiStepStrategy.on_action!(a, "skip_step");
    const finished = multiStepStrategy.on_action!(b, "skip_step");
    expect(finished.finished).toBe(true);
    const rewound = multiStepStrategy.on_action!(finished, "previous_step");
    expect(rewound.finished).toBe(false);
    expect(rewound.current_step).toBe(2);
    expect(rewound.step_remaining).toBe(30);
  });

  it("clears agitation_pending on rewind", () => {
    const s = multiStepStrategy.initial_state(three_step_config);
    const after_skip = multiStepStrategy.on_action!(s, "skip_step");
    const with_pending = { ...after_skip, agitation_pending: true };
    const rewound = multiStepStrategy.on_action!(with_pending, "previous_step");
    expect(rewound.agitation_pending).toBe(false);
  });
});
