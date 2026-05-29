import { describe, expect, it } from "vitest";

import { getRefactoringNeighbors } from "@/refactorings/lib/getRefactoringNeighbors";

describe("getRefactoringNeighbors", () => {
  it("returns no previous neighbor for the first entry", () => {
    const { prev, next } = getRefactoringNeighbors(1);

    expect(prev).toBeNull();
    expect(next).not.toBeNull();
    expect(next?.number).toBe(2);
  });

  it("returns both neighbors for a middle entry", () => {
    const { prev, next } = getRefactoringNeighbors(5);

    expect(prev?.number).toBe(4);
    expect(prev?.name).toBe("Inline Variable");
    expect(prev?.href).toBe("/refactoring/canon/inline-variable");
    expect(next?.number).toBe(6);
    expect(next?.name).toBe("Encapsulate Variable");
    expect(next?.href).toBe("/refactoring/canon/encapsulate-variable");
  });

  it("returns no next neighbor for the last entry", () => {
    const total = 66;
    const { prev, next } = getRefactoringNeighbors(total);

    expect(prev?.number).toBe(total - 1);
    expect(next).toBeNull();
  });
});
