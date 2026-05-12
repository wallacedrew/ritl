import { describe, expect, it } from "vitest";

import { getSmellNeighbors } from "@/smells/lib/getSmellNeighbors";

describe("getSmellNeighbors", () => {
  it("returns no previous neighbor for the first smell", () => {
    const { prev, next } = getSmellNeighbors(1);

    expect(prev).toBeNull();
    expect(next).not.toBeNull();
    expect(next?.number).toBe(2);
  });

  it("returns both neighbors for a middle smell", () => {
    const { prev, next } = getSmellNeighbors(3);

    expect(prev?.number).toBe(2);
    expect(prev?.href).toBe("/smells/duplicated-code");
    expect(next?.number).toBe(4);
    expect(next?.href).toBe("/smells/long-parameter-list");
  });

  it("returns no next neighbor for the last smell", () => {
    const total = 24;
    const { prev, next } = getSmellNeighbors(total);

    expect(prev?.number).toBe(total - 1);
    expect(next).toBeNull();
  });
});
