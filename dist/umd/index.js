(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./svg-to-polygons", "./compare", "./path-to-polygons", "./compare", "./svg-to-polygons"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.pathToPolygons = exports.compare = exports.svgPathToPolygons = void 0;
    var svg_to_polygons_1 = require("./svg-to-polygons");
    Object.defineProperty(exports, "svgPathToPolygons", { enumerable: true, get: function () { return svg_to_polygons_1.svgPathToPolygons; } });
    var compare_1 = require("./compare");
    Object.defineProperty(exports, "compare", { enumerable: true, get: function () { return compare_1.compare; } });
    var path_to_polygons_1 = require("./path-to-polygons");
    Object.defineProperty(exports, "pathToPolygons", { enumerable: true, get: function () { return path_to_polygons_1.pathToPolygons; } });
    const compare_2 = require("./compare");
    const svg_to_polygons_2 = require("./svg-to-polygons");
    exports.default = {
        pathDataToPolys: svg_to_polygons_2.svgPathToPolygons,
        compare: compare_2.compare,
    };
});
