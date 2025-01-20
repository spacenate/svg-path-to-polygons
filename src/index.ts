import { parseSVG, makeAbsolute, CommandMadeAbsolute } from "svg-path-parser";
import { sampleCubicBezier } from "./cubic";
import { Polygon, SvgPathToPolygonsOptions } from "./types";

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
        addPoint(cmd.x!, cmd.y!);
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
          tolerance2,
          addPoint,
        );
        addPoint(cmd.x!, cmd.y!);
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
          tolerance2,
          addPoint,
        );
        addPoint(cmd.x!, cmd.y!);
        break;
      }

      default:
        console.error(
          `Unsupported command: ${cmd.command} (${cmd.code}). Exiting.`,
        );
        return;
    }
    prev = cmd;
  });

  return polys;

  /**
   * Helper to add points to the current polygon
   */
  function addPoint(x: number, y: number): void {
    if (opts.decimals && opts?.decimals >= 0) {
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
export default {
  pathDataToPolys: svgPathToPolygons,
  compare,
};
