export class Point {
  private constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  static at(x: number, y: number): Point {
    return new Point(x, y);
  }

  translate(deltaX: number, deltaY: number): Point {
    return Point.at(this.x + deltaX, this.y + deltaY);
  }

  equals(other: Point): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
