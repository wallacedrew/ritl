const LEGAL_VALUES = ["types/compiler", "unit test", "characterization test"] as const;

type SafetyNetValue = (typeof LEGAL_VALUES)[number];

function isLegal(candidate: string): candidate is SafetyNetValue {
  return (LEGAL_VALUES as readonly string[]).includes(candidate);
}

export class SafetyNet {
  private constructor(private readonly value: SafetyNetValue) {}

  static from(raw: string): SafetyNet {
    if (!isLegal(raw)) {
      throw new Error(
        `SafetyNet: unknown safety net "${raw}". Legal values: ${LEGAL_VALUES.join(", ")}`,
      );
    }
    return new SafetyNet(raw);
  }

  toString(): string {
    return this.value;
  }

  equals(other: SafetyNet): boolean {
    return this.value === other.value;
  }
}
