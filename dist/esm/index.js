export { svgPathToPolygons } from "./svg-to-polygons";
export { compare } from "./compare";
export { pathToPolygons } from "./path-to-polygons";
import { compare } from "./compare";
import { svgPathToPolygons } from "./svg-to-polygons";
export default {
    pathDataToPolys: svgPathToPolygons,
    compare,
};
