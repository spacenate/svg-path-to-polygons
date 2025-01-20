export function sampleCubicBezier(
  x0: number,
  y0: number,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  tolerance2: number,
  addPoint: (x: number, y: number) => void,
): void {
  // ignore degenerate curves
  if (
    x0 === x1 &&
    x0 === x2 &&
    x0 === x3 &&
    y0 === y1 &&
    y0 === y2 &&
    y0 === y3
  ) {
    return;
  }
  const x01 = (x0 + x1) / 2,
    y01 = (y0 + y1) / 2,
    x12 = (x1 + x2) / 2,
    y12 = (y1 + y2) / 2,
    x23 = (x2 + x3) / 2,
    y23 = (y2 + y3) / 2,
    x012 = (x01 + x12) / 2,
    y012 = (y01 + y12) / 2,
    x123 = (x12 + x23) / 2,
    y123 = (y12 + y23) / 2,
    x0123 = (x012 + x123) / 2,
    y0123 = (y012 + y123) / 2;

  const dx = x3 - x0,
    dy = y3 - y0;

  const d1 = Math.abs((x1 - x3) * dy - (y1 - y3) * dx),
    d2 = Math.abs((x2 - x3) * dy - (y2 - y3) * dx);

  if ((d1 + d2) * (d1 + d2) < tolerance2 * (dx * dx + dy * dy))
    addPoint(x0123, y0123);
  else {
    sampleCubicBezier(
      x0,
      y0,
      x01,
      y01,
      x012,
      y012,
      x0123,
      y0123,
      tolerance2,
      addPoint,
    );
    sampleCubicBezier(
      x0123,
      y0123,
      x123,
      y123,
      x23,
      y23,
      x3,
      y3,
      tolerance2,
      addPoint,
    );
  }
}
