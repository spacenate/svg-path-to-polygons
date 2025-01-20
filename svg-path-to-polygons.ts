import { parseSVG, makeAbsolute, CommandMadeAbsolute } from "svg-path-parser";

export type SvgPathToPolygonsOptions = {
  tolerance?: number; // Tolerance for approximation
  decimals?: number; // Number of decimal places to round coordinates
};

export type Point = [number, number];

export type Polygon = Point[] & { closed?: boolean }; // Array of points with an optional 'closed' flag

/**
 * Converts an SVG path string to an array of polygons.
 * @param svgPathString The SVG path string to convert.
 * @param opts Optional configuration object.
 * @returns An array of polygons (arrays of points).
 */
export function svgPathToPolygons(
  svgPathString: string,
  opts: SvgPathToPolygonsOptions = {},
): Polygon[] {
  if (!opts.tolerance) opts.tolerance = 1;

  const polys: Polygon[] = [];
  const tolerance2 = opts.tolerance * opts.tolerance;
  let poly: Polygon = [];
  let prev: CommandMadeAbsolute | undefined;

  makeAbsolute(parseSVG(svgPathString)).forEach((cmd) => {
    switch (cmd.code) {
      case "M":
        polys.push((poly = []));
      // intentional flow-through
      case "L":
      case "H":
      case "V":
      case "Z":
        add(cmd.x!, cmd.y!);
        if (cmd.code === "Z") poly.closed = true;
        break;

      case "C":
        sampleCubicBezier(
          cmd.x0!,
          cmd.y0!,
          cmd.x1!,
          cmd.y1!,
          cmd.x2!,
          cmd.y2!,
          cmd.x!,
          cmd.y!,
        );
        add(cmd.x!, cmd.y!);
        break;

      case "S": {
        let x1 = 0,
          y1 = 0;
        if (prev) {
          if (prev.code === "C") {
            x1 = prev.x! * 2 - prev.x2!;
            y1 = prev.y! * 2 - prev.y2!;
          } else {
            x1 = prev.x!;
            y1 = prev.y!;
          }
        }
        sampleCubicBezier(
          cmd.x0!,
          cmd.y0!,
          x1,
          y1,
          cmd.x2!,
          cmd.y2!,
          cmd.x!,
          cmd.y!,
        );
        add(cmd.x!, cmd.y!);
        break;
      }

      default:
        console.error(
          `Unsupported command: ${cmd.command} (${cmd.code}). Exiting.`,
        );
        // process.exit(2);
        return;
    }
    prev = cmd;
  });

  return polys;

  // Helper functions
  function sampleCubicBezier(
    x0: number,
    y0: number,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    x3: number,
    y3: number,
  ): void {
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
      add(x0123, y0123);
    else {
      sampleCubicBezier(x0, y0, x01, y01, x012, y012, x0123, y0123);
      sampleCubicBezier(x0123, y0123, x123, y123, x23, y23, x3, y3);
    }
  }

  function add(x: number, y: number): void {
    if (opts.decimals && opts.decimals >= 0) {
      x = Number(x.toFixed(opts.decimals));
      y = Number(y.toFixed(opts.decimals));
    }
    poly.push([x, y]);
  }
}

/**
 * Generates an SVG representation comparing the path and its polygon approximation.
 * Outputs the result directly to the console.
 * @param pathData The SVG path string to compare.
 * @param opts Optional configuration object for polygon generation.
 */
export function compare(
  pathData: string,
  opts: SvgPathToPolygonsOptions = {},
): void {
  const polys = svgPathToPolygons(pathData, opts);

  let minX = Infinity,
    maxX = -Infinity,
    minY = Infinity,
    maxY = -Infinity;

  polys.forEach((poly) =>
    poly.forEach(([x, y]) => {
      if (x < minX) minX = x;
      if (y < minY) minY = y;
      if (x > maxX) maxX = x;
      if (y > maxY) maxY = y;
    }),
  );

  const dx = maxX - minX;
  const dy = maxY - minY;

  console.log(
    `
<svg xmlns="http://www.w3.org/2000/svg" width="${dx}px" height="${dy}px" viewBox="${minX} ${minY} ${dx * 2} ${dy}">
<style>path,polygon,polyline { fill-opacity:0.2; stroke:black }</style>
<path d="${pathData}"/>
<g transform="translate(${dx},0)">
${polys
  .map(
    (poly) =>
      `  <${
        poly.closed ? "polygon" : "polyline"
      } points="${poly.map(([x, y]) => `${x},${y}`).join(" ")}"/>`,
  )
  .join("\n")}
</g>
</svg>
  `.trim(),
  );
}

// Exported object for compatibility
export default {
  pathDataToPolys: svgPathToPolygons,
  compare,
};
