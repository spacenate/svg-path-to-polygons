import { Polygon, SvgPathToPolygonsOptions } from "./types";
/**
 * Converts an SVG path string to an array of polygons.
 * @param svgPathString The SVG path string to convert.
 * @param opts Optional configuration object.
 * @returns An array of polygons (arrays of points).
 */
export declare function svgPathToPolygons(svgPathString: string, opts?: SvgPathToPolygonsOptions): Polygon[];
