import type { Point } from "./types";

export function ellipticArcToCubicBezierCurves(
  p1: Point,
  p2: Point,
  r: [number, number],
  xAxisRotation: number,
  largeArc: boolean,
  sweep: boolean,
): [Point, Point, Point, Point][] {
  const _zeroTolerance = 1e-5;

  // Convert endpoint parameters to center parameters
  const [adjustedR, center, angles] = endpointToCenterArcParams(
    p1,
    p2,
    r,
    xAxisRotation,
    largeArc,
    sweep,
  );
  const radius = adjustedR;
  const [startAngle, deltaAngle] = angles;

  // Decompose elliptical arc into Bézier curves
  const curves: [Point, Point, Point, Point][] = [];
  let angle = startAngle;
  const endAngle = startAngle + deltaAngle;
  const sign = deltaAngle < 0 ? -1 : 1;
  const remainingAngle = Math.abs(deltaAngle);

  let currentPoint = computeEllipticArcPoint(
    center,
    radius,
    xAxisRotation,
    angle,
  );

  while (remainingAngle > _zeroTolerance) {
    const step = Math.min(remainingAngle, Math.PI / 4); // Subdivide into <= 90-degree segments
    const nextAngle = angle + step * sign;

    const nextPoint = computeEllipticArcPoint(
      center,
      radius,
      xAxisRotation,
      nextAngle,
    );

    const alphaT = Math.tan(step / 2);
    const alpha =
      (Math.sin(step) * (Math.sqrt(4 + 3 * alphaT * alphaT) - 1)) / 3;

    const derivativeStart = computeEllipticArcDerivative(
      center,
      radius,
      xAxisRotation,
      angle,
    );
    const derivativeEnd = computeEllipticArcDerivative(
      center,
      radius,
      xAxisRotation,
      nextAngle,
    );

    const controlPoint1: Point = [
      currentPoint[0] + alpha * derivativeStart[0],
      currentPoint[1] + alpha * derivativeStart[1],
    ];
    const controlPoint2: Point = [
      nextPoint[0] - alpha * derivativeEnd[0],
      nextPoint[1] - alpha * derivativeEnd[1],
    ];

    curves.push([currentPoint, nextPoint, controlPoint1, controlPoint2]);

    angle = nextAngle;
    currentPoint = nextPoint;
  }

  return curves;
}

// Convert endpoint arc parameters to center parameters
function endpointToCenterArcParams(
  p1: Point,
  p2: Point,
  r: [number, number],
  xAxisRotation: number,
  largeArc: boolean,
  sweep: boolean,
): [[number, number], Point, [number, number]] {
  let rx = Math.abs(r[0]);
  let ry = Math.abs(r[1]);

  const dx2 = (p1[0] - p2[0]) / 2.0;
  const dy2 = (p1[1] - p2[1]) / 2.0;

  const x1p = Math.cos(xAxisRotation) * dx2 + Math.sin(xAxisRotation) * dy2;
  const y1p = -Math.sin(xAxisRotation) * dx2 + Math.cos(xAxisRotation) * dy2;

  const rxs = rx ** 2;
  const rys = ry ** 2;
  const x1ps = x1p ** 2;
  const y1ps = y1p ** 2;

  let cr = x1ps / rxs + y1ps / rys;
  if (cr > 1) {
    const scale = Math.sqrt(cr);
    rx *= scale;
    ry *= scale;
  }

  const dq = rxs * rys - rxs * y1ps - rys * x1ps;
  const pq = Math.sqrt(Math.max(0, dq) / (rxs * y1ps + rys * x1ps));
  const q = largeArc !== sweep ? pq : -pq;

  const cxp = (q * rx * y1p) / ry;
  const cyp = (-q * ry * x1p) / rx;

  const cx =
    Math.cos(xAxisRotation) * cxp -
    Math.sin(xAxisRotation) * cyp +
    (p1[0] + p2[0]) / 2.0;
  const cy =
    Math.sin(xAxisRotation) * cxp +
    Math.cos(xAxisRotation) * cyp +
    (p1[1] + p2[1]) / 2.0;

  const theta = svgAngle(1, 0, (x1p - cxp) / rx, (y1p - cyp) / ry);
  const delta = svgAngle(
    (x1p - cxp) / rx,
    (y1p - cyp) / ry,
    (-x1p - cxp) / rx,
    (-y1p - cyp) / ry,
  );

  return [
    [rx, ry],
    [cx, cy],
    [theta, delta % (2 * Math.PI)],
  ];
}

// Compute a point on the elliptic arc at angle `t`
function computeEllipticArcPoint(
  center: Point,
  radius: [number, number],
  xAxisRotation: number,
  t: number,
): Point {
  return [
    center[0] +
      radius[0] * Math.cos(xAxisRotation) * Math.cos(t) -
      radius[1] * Math.sin(xAxisRotation) * Math.sin(t),
    center[1] +
      radius[0] * Math.sin(xAxisRotation) * Math.cos(t) +
      radius[1] * Math.cos(xAxisRotation) * Math.sin(t),
  ];
}

// Compute the derivative of the elliptic arc at angle `t`
function computeEllipticArcDerivative(
  center: Point,
  radius: [number, number],
  xAxisRotation: number,
  t: number,
): Point {
  return [
    -radius[0] * Math.cos(xAxisRotation) * Math.sin(t) -
      radius[1] * Math.sin(xAxisRotation) * Math.cos(t),
    -radius[0] * Math.sin(xAxisRotation) * Math.sin(t) +
      radius[1] * Math.cos(xAxisRotation) * Math.cos(t),
  ];
}

// Compute the angle between two vectors
function svgAngle(ux: number, uy: number, vx: number, vy: number): number {
  const dot = ux * vx + uy * vy;
  const len = Math.sqrt((ux ** 2 + uy ** 2) * (vx ** 2 + vy ** 2));
  const angle = Math.acos(Math.max(-1, Math.min(1, dot / len)));
  return ux * vy - uy * vx < 0 ? -angle : angle;
}
