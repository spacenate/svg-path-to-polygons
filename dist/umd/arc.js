var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "svg-arc-to-cubic-bezier"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.ellipticArcToCubicBezierCurves = ellipticArcToCubicBezierCurves;
    const svg_arc_to_cubic_bezier_1 = __importDefault(require("svg-arc-to-cubic-bezier"));
    function ellipticArcToCubicBezierCurves(p1, p2, r, xAxisRotation, largeArc, sweep) {
        const curves = (0, svg_arc_to_cubic_bezier_1.default)({
            px: p1[0],
            py: p1[1],
            cx: p2[0],
            cy: p2[1],
            rx: r[0],
            ry: r[1],
            xAxisRotation,
            largeArcFlag: largeArc ? 1 : 0,
            sweepFlag: sweep ? 1 : 0,
        });
        return curves.map((c, i) => {
            const startPoint = i === 0 ? [p1[0], p1[1]] : [curves[i - 1].x, curves[i - 1].y];
            return [startPoint, [c.x1, c.y1], [c.x2, c.y2], [c.x, c.y]];
        });
    }
});
