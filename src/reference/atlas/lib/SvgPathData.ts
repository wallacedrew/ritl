import { Point } from "./Point";

export class SvgPathData {
  private constructor(private readonly raw: string) {}

  static fromRaw(raw: string): SvgPathData {
    return new SvgPathData(raw);
  }

  static curveBetween(start: Point, finish: Point): SvgPathData {
    const horizontalMidpoint = (start.x + finish.x) / 2;
    const startControl = Point.at(horizontalMidpoint, start.y);
    const finishControl = Point.at(horizontalMidpoint, finish.y);
    const raw = `M ${start.x} ${start.y} C ${startControl.x} ${startControl.y}, ${finishControl.x} ${finishControl.y}, ${finish.x} ${finish.y}`;
    return new SvgPathData(raw);
  }

  toString(): string {
    return this.raw;
  }
}
