(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./svg-path-to-polygons", "./compare", "./svg-path-to-polygons", "./compare"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compare = exports.svgPathToPolygons = void 0;
    var svg_path_to_polygons_1 = require("./svg-path-to-polygons");
    Object.defineProperty(exports, "svgPathToPolygons", { enumerable: true, get: function () { return svg_path_to_polygons_1.svgPathToPolygons; } });
    var compare_1 = require("./compare");
    Object.defineProperty(exports, "compare", { enumerable: true, get: function () { return compare_1.compare; } });
    const svg_path_to_polygons_2 = require("./svg-path-to-polygons");
    const compare_2 = require("./compare");
    exports.default = {
        pathDataToPolys: svg_path_to_polygons_2.svgPathToPolygons,
        compare: compare_2.compare,
    };
});
