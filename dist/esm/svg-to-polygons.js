import { parseSVG, makeAbsolute } from "svg-path-parser";
import { pathToPolygons } from "./path-to-polygons";
/**
 * Converts an SVG path string to an array of path Commands.
 * @param svgPathString The SVG path string to convert.
 * @returns An array of SVG Path Commands.
 */
export function svgPathToPolygons(svgPathString, opts = {}) {
    const commands = makeAbsolute(parseSVG(svgPathString));
    return pathToPolygons(commands, opts);
}
