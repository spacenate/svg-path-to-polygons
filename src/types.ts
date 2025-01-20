export type SvgPathToPolygonsOptions = {
  tolerance?: number; // Tolerance for approximation
  decimals?: number; // Number of decimal places to round coordinates
};

export type Point = [number, number];

export type Polygon = Point[] & { closed?: boolean }; // Array of points with an optional 'closed' flag
