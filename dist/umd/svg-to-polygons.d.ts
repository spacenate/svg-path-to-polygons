import { Polygon, SvgPathToPolygonsOptions } from "./types";
/**
 * Converts an SVG path string to an array of path Commands.
 * @param svgPathString The SVG path string to convert.
 * @returns An array of SVG Path Commands.
 */
export declare function svgPathToPolygons(svgPathString: string, opts?: SvgPathToPolygonsOptions): Polygon[];
