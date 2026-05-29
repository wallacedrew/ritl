import { describe, expect, it } from "vitest";

import { Point } from "@/reference/atlas/lib/Point";

describe("Point", () => {
  it("exposes the x and y coordinates it was constructed with", () => {
    const point = Point.at(10, 20);

    expect(point.x).toBe(10);
    expect(point.y).toBe(20);
  });

  it("compares equal to another Point with the same coordinates", () => {
    expect(Point.at(3, 4).equals(Point.at(3, 4))).toBe(true);
  });

  it("compares unequal to a Point with different coordinates", () => {
    expect(Point.at(3, 4).equals(Point.at(3, 5))).toBe(false);
  });

  it("translates by an offset to produce a new Point", () => {
    const translated = Point.at(10, 20).translate(5, -2);

    expect(translated.equals(Point.at(15, 18))).toBe(true);
  });
});
