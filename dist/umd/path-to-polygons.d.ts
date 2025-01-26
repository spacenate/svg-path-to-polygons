import { CommandMadeAbsolute } from "svg-path-parser";
import { Polygon, SvgPathToPolygonsOptions } from "./types";
/**
 * Converts SVG path commands to an array of polygons.
 * @param commands The SVG path commands to convert.
 * @param opts Optional configuration object.
 * @returns An array of polygons (arrays of points).
 */
export declare function pathToPolygons(commands: CommandMadeAbsolute[], opts?: SvgPathToPolygonsOptions): Polygon[];
