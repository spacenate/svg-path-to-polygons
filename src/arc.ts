import type { Point } from "./types";
import arcToBezier from "svg-arc-to-cubic-bezier";

export function ellipticArcToCubicBezierCurves(
  p1: Point,
  p2: Point,
  r: [number, number],
  xAxisRotation: number,
  largeArc: boolean,
  sweep: boolean,
): [Point, Point, Point, Point][] {
  const curves = arcToBezier({
    px: p1[0],
    py: p1[1],
    cx: p2[0],
    cy: p2[1],
    rx: r[0],
    ry: r[1],
    xAxisRotation,
    largeArcFlag: largeArc ? 1 : 0,
    sweepFlag: sweep ? 1 : 0,
  });
  return curves.map((c, i) => {
    const startPoint =
      i === 0 ? [p1[0], p1[1]] : [curves[i - 1].x, curves[i - 1].y];
    return [startPoint, [c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]];
  }) as [Point, Point, Point, Point][];
}
