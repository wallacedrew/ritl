import { describe, expect, it } from "vitest";

import { firstSentenceCaption } from "@/shared/lib/firstSentenceCaption";

describe("firstSentenceCaption extracts a short card caption from a multi-sentence force field", () => {
  it("returns the first sentence of a multi-sentence string", () => {
    const text = "First sentence ends here. Second sentence elaborates.";
    expect(firstSentenceCaption(text)).toBe("First sentence ends here.");
  });

  it("strips {{glossary-key}} markers from the returned caption", () => {
    const text = "Functions with {{accidental complexity}} are hard to read. They cost a lot.";
    expect(firstSentenceCaption(text)).toBe(
      "Functions with accidental complexity are hard to read.",
    );
  });

  it("returns the whole text when there is no terminating punctuation", () => {
    expect(firstSentenceCaption("No period here")).toBe("No period here");
  });

  it("trims surrounding whitespace from the returned caption", () => {
    expect(firstSentenceCaption("   Padded sentence.   Padded too.")).toBe("Padded sentence.");
  });

  it("treats !!! and ??? as terminators too", () => {
    expect(firstSentenceCaption("Whoa! And then.")).toBe("Whoa!");
    expect(firstSentenceCaption("Really? Yes.")).toBe("Really?");
  });
});
