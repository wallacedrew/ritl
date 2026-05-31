import { describe, expect, it } from "vitest";

import { Forces } from "@/shared/lib/Forces";
import { toForcesRecord } from "@/shared/lib/toForcesRecord";

describe("toForcesRecord", () => {
  it("projects a Forces value object onto its plain record", () => {
    const forces = Forces.from({
      symptom: "S",
      goal: "G",
      pressure: "P",
      tradeoff: "T",
      relief: "R",
      trap: "X",
    });

    expect(toForcesRecord(forces)).toEqual({
      symptom: "S",
      goal: "G",
      pressure: "P",
      tradeoff: "T",
      relief: "R",
      trap: "X",
    });
  });
});
