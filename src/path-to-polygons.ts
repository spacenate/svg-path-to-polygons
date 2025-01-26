import { CommandMadeAbsolute } from "svg-path-parser";
import { sampleCubicBezier } from "./cubic";
import { Polygon, SvgPathToPolygonsOptions } from "./types";
import { quadraticToCubicBezier } from "./quadratic";
import { ellipticArcToCubicBezierCurves } from "./arc";

/**
 * Converts SVG path commands to an array of polygons.
 * @param commands The SVG path commands to convert.
 * @param opts Optional configuration object.
 * @returns An array of polygons (arrays of points).
 */
export function pathCommandsToPolygons(
  commands: CommandMadeAbsolute[],
  opts: SvgPathToPolygonsOptions = {},
): Polygon[] {
  if (!opts.tolerance) opts.tolerance = 1;

  const polys: Polygon[] = [];
  const tolerance2 = opts.tolerance * opts.tolerance;
  let poly: Polygon = [];
  let prev: CommandMadeAbsolute | undefined;

  commands.forEach((cmd) => {
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
          if (prev.code === "C" || prev.code === "S") {
            x1 = cmd.x0! * 2 - prev.x2!;
            y1 = cmd.y0! * 2 - prev.y2!;
          } else {
            x1 = cmd.x0!;
            y1 = cmd.y0!;
          }
        } else {
          x1 = cmd.x0!;
          y1 = cmd.y0!;
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

      case "Q": {
        const [cp0, cp1, cp2, cp3] = quadraticToCubicBezier(cmd);
        sampleCubicBezier(
          cp0[0],
          cp0[1],
          cp1[0],
          cp1[1],
          cp2[0],
          cp2[1],
          cp3[0],
          cp3[1],
          tolerance2,
          addPoint,
        );
        addPoint(cp3[0], cp3[1]);
        break;
      }

      case "A": {
        const curves = ellipticArcToCubicBezierCurves(
          [cmd.x0!, cmd.y0!],
          [cmd.x!, cmd.y!],
          [cmd.rx!, cmd.ry!],
          cmd.xAxisRotation,
          cmd.largeArc,
          cmd.sweep,
        );
        curves.forEach(([p0, p1, p2, p3], i) => {
          if (i === 0) addPoint(p0[0], p0[1]);
          sampleCubicBezier(
            p0[0],
            p0[1],
            p1[0],
            p1[1],
            p2[0],
            p2[1],
            p3[0],
            p3[1],
            tolerance2,
            addPoint,
          );
          addPoint(p3[0], p3[1]);
        });
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
