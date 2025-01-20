export type SvgPathToPolygonsOptions = {
    tolerance?: number;
    decimals?: number;
};
export type Point = [number, number];
export type Polygon = Point[] & {
    closed?: boolean;
};
