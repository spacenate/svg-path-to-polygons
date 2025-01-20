import { QuadraticCurveToCommandMadeAbsolute } from "svg-path-parser";
import { Point } from "./types";
export declare function quadraticToCubicBezier(cmd: QuadraticCurveToCommandMadeAbsolute): [Point, Point, Point, Point];
