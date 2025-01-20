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
