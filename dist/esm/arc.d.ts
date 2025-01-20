import type { Point } from "./types";
export declare function ellipticArcToCubicBezierCurves(p1: Point, p2: Point, r: [number, number], xAxisRotation: number, largeArc: boolean, sweep: boolean): [Point, Point, Point, Point][];
