import { describe, expect, it } from "vitest";

import { SafetyNet } from "@/refactorings/lib/SafetyNet";

describe("SafetyNet", () => {
  it("accepts types/compiler as a legal value", () => {
    expect(SafetyNet.from("types/compiler").toString()).toBe("types/compiler");
  });

  it("accepts unit test as a legal value", () => {
    expect(SafetyNet.from("unit test").toString()).toBe("unit test");
  });

  it("accepts characterization test as a legal value", () => {
    expect(SafetyNet.from("characterization test").toString()).toBe("characterization test");
  });

  it("rejects an unknown value at construction", () => {
    expect(() => SafetyNet.from("integration test")).toThrow(/unknown safety net/i);
  });

  it("rejects an empty value at construction", () => {
    expect(() => SafetyNet.from("")).toThrow(/unknown safety net/i);
  });

  it("treats safety nets with the same value as equal", () => {
    expect(SafetyNet.from("types/compiler").equals(SafetyNet.from("types/compiler"))).toBe(true);
  });

  it("treats safety nets with different values as unequal", () => {
    expect(SafetyNet.from("types/compiler").equals(SafetyNet.from("unit test"))).toBe(false);
  });
});
