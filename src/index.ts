export { svgPathToPolygons } from "./svg-to-polygons";
export { pathCommandsToPolygons } from "./path-to-polygons";
export { compare } from "./compare";

import { svgPathToPolygons } from "./svg-to-polygons";
import { compare } from "./compare";

export default {
  pathDataToPolys: svgPathToPolygons,
  compare,
};
