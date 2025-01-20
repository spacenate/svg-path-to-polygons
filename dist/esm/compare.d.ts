import { SvgPathToPolygonsOptions } from "./types";
/**
 * Generates an SVG representation comparing the path and its polygon approximation.
 * Returns the result as an SVG element that can be added to the DOM.
 * @param pathData The SVG path string to compare.
 * @param opts Optional configuration object for polygon generation.
 */
export declare function compare(pathData: string, opts?: SvgPathToPolygonsOptions, scale?: number): {
    svg: SVGSVGElement;
    polygons: import("./types").Polygon[];
};
