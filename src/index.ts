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
 * Returns the result as an SVG element that can be added to the DOM.
 * @param pathData The SVG path string to compare.
 * @param opts Optional configuration object for polygon generation.
 */
export function compare(
  pathData: string,
  opts: SvgPathToPolygonsOptions = {},
  scale = 1,
) {
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

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
  svg.setAttribute("width", `${dx * scale}px`);
  svg.setAttribute("height", `${dy * scale}px`);
  const margin = 10;
  svg.setAttribute(
    "viewBox",
    `${minX - margin} ${minY - margin} ${dx + margin * 2} ${dy + margin * 2}`,
  );

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", pathData);
  path.setAttribute("class", "original-path");
  svg.appendChild(path);

  const group = document.createElementNS("http://www.w3.org/2000/svg", "g");

  polys.forEach((poly) => {
    const element = document.createElementNS(
      "http://www.w3.org/2000/svg",
      poly.closed ? "polygon" : "polyline",
    );
    element.setAttribute("points", poly.map(([x, y]) => `${x},${y}`).join(" "));
    element.setAttribute("class", "polygon-path");
    group.appendChild(element);
  });

  svg.appendChild(group);

  return { svg, polygons: polys };
}

export default {
  pathDataToPolys: svgPathToPolygons,
  compare,
};
