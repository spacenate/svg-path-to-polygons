(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./svg-to-polygons"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.compare = compare;
    const svg_to_polygons_1 = require("./svg-to-polygons");
    /**
     * Generates an SVG representation comparing the path and its polygon approximation.
     * Returns the result as an SVG element that can be added to the DOM.
     * @param pathData The SVG path string to compare.
     * @param opts Optional configuration object for polygon generation.
     */
    function compare(pathData, opts = {}, scale = 1) {
        const polys = (0, svg_to_polygons_1.svgPathToPolygons)(pathData, opts);
        let minX = Infinity, maxX = -Infinity, minY = Infinity, maxY = -Infinity;
        polys.forEach((poly) => poly.forEach(([x, y]) => {
            if (x < minX)
                minX = x;
            if (y < minY)
                minY = y;
            if (x > maxX)
                maxX = x;
            if (y > maxY)
                maxY = y;
        }));
        const dx = maxX - minX;
        const dy = maxY - minY;
        const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
        svg.setAttribute("width", `${dx * scale}px`);
        svg.setAttribute("height", `${dy * scale}px`);
        const margin = 10;
        svg.setAttribute("viewBox", `${minX - margin} ${minY - margin} ${dx + margin * 2} ${dy + margin * 2}`);
        const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
        path.setAttribute("d", pathData);
        path.setAttribute("class", "original-path");
        svg.appendChild(path);
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        polys.forEach((poly) => {
            const element = document.createElementNS("http://www.w3.org/2000/svg", poly.closed ? "polygon" : "polyline");
            element.setAttribute("points", poly.map(([x, y]) => `${x},${y}`).join(" "));
            element.setAttribute("class", "polygon-path");
            group.appendChild(element);
        });
        svg.appendChild(group);
        return { svg, polygons: polys };
    }
});
