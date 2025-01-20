(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.quadraticToCubicBezier = quadraticToCubicBezier;
    function quadraticToCubicBezier(cmd) {
        const p0 = [cmd.x0, cmd.y0];
        const p1 = [cmd.x1, cmd.y1];
        const p2 = [cmd.x, cmd.y];
        const cp0 = p0;
        const cp3 = p2;
        const cp1 = [
            p0[0] + (2 / 3) * (p1[0] - p0[0]),
            p0[1] + (2 / 3) * (p1[1] - p0[1]),
        ];
        const cp2 = [
            p2[0] + (2 / 3) * (p1[0] - p2[0]),
            p2[1] + (2 / 3) * (p1[1] - p2[1]),
        ];
        return [cp0, cp1, cp2, cp3];
    }
});
