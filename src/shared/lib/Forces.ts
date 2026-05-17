export type ForcesRecord = {
  symptom: string;
  goal: string;
  pressure: string;
  tradeoff: string;
  relief: string;
  trap: string;
};

export class Forces {
  private constructor(
    readonly symptom: string,
    readonly goal: string,
    readonly pressure: string,
    readonly tradeoff: string,
    readonly relief: string,
    readonly trap: string,
  ) {
    assertNonEmpty("symptom", symptom);
    assertNonEmpty("goal", goal);
    assertNonEmpty("pressure", pressure);
    assertNonEmpty("tradeoff", tradeoff);
    assertNonEmpty("relief", relief);
    assertNonEmpty("trap", trap);
  }

  static from(record: ForcesRecord): Forces {
    return new Forces(
      record.symptom,
      record.goal,
      record.pressure,
      record.tradeoff,
      record.relief,
      record.trap,
    );
  }

  equals(other: Forces): boolean {
    return (
      this.symptom === other.symptom &&
      this.goal === other.goal &&
      this.pressure === other.pressure &&
      this.tradeoff === other.tradeoff &&
      this.relief === other.relief &&
      this.trap === other.trap
    );
  }
}

function assertNonEmpty(field: string, value: string): void {
  if (value.trim().length === 0) {
    throw new Error(`Forces: field "${field}" cannot be empty`);
  }
}
