import { QuadraticCurveToCommandMadeAbsolute } from "svg-path-parser";
import { Point } from "./types";

export function quadraticToCubicBezier(
  cmd: QuadraticCurveToCommandMadeAbsolute,
): [Point, Point, Point, Point] {
  const p0: Point = [cmd.x0!, cmd.y0!];
  const p1: Point = [cmd.x1!, cmd.y1!];
  const p2: Point = [cmd.x!, cmd.y!];

  const cp0 = p0;
  const cp3 = p2;
  const cp1: Point = [
    p0[0] + (2 / 3) * (p1[0] - p0[0]),
    p0[1] + (2 / 3) * (p1[1] - p0[1]),
  ];
  const cp2: Point = [
    p2[0] + (2 / 3) * (p1[0] - p2[0]),
    p2[1] + (2 / 3) * (p1[1] - p2[1]),
  ];

  return [cp0, cp1, cp2, cp3];
}
