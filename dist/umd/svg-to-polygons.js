(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "svg-path-parser", "./path-to-polygons"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.svgPathToPolygons = svgPathToPolygons;
    const svg_path_parser_1 = require("svg-path-parser");
    const path_to_polygons_1 = require("./path-to-polygons");
    /**
     * Converts an SVG path string to an array of path Commands.
     * @param svgPathString The SVG path string to convert.
     * @returns An array of SVG Path Commands.
     */
    function svgPathToPolygons(svgPathString, opts = {}) {
        const commands = (0, svg_path_parser_1.makeAbsolute)((0, svg_path_parser_1.parseSVG)(svgPathString));
        return (0, path_to_polygons_1.pathToPolygons)(commands, opts);
    }
});
