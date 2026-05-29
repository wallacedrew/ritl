import { describe, expect, it } from "vitest";

import { Point } from "@/reference/atlas/lib/Point";
import { SvgPathData } from "@/reference/atlas/lib/SvgPathData";

describe("SvgPathData", () => {
  it("returns the wrapped path string from toString", () => {
    expect(SvgPathData.fromRaw("M 0 0 L 10 10").toString()).toBe("M 0 0 L 10 10");
  });

  it("builds a horizontally-symmetric cubic Bezier curve between two points", () => {
    const start = Point.at(0, 0);
    const finish = Point.at(100, 50);

    const path = SvgPathData.curveBetween(start, finish);

    expect(path.toString()).toBe("M 0 0 C 50 0, 50 50, 100 50");
  });

  it("survives zero horizontal distance without producing NaN", () => {
    const start = Point.at(20, 0);
    const finish = Point.at(20, 80);

    expect(SvgPathData.curveBetween(start, finish).toString()).toBe("M 20 0 C 20 0, 20 80, 20 80");
  });
});
