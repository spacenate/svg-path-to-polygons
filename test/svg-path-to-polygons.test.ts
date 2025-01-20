import { describe, it, expect } from "vitest";
import { svgPathToPolygons } from "../svg-path-to-polygons";

const expectations = [
	{
		m: "linear open",
		d: "M5,7 10,20 30,40",
		o: [
			[
				[5, 7],
				[10, 20],
				[30, 40],
			],
		],
		closed: [false],
	},
	{
		m: "linear closed",
		d: "M5,7 10,20 30,40 z",
		o: [
			[
				[5, 7],
				[10, 20],
				[30, 40],
				[5, 7],
			],
		],
		closed: [true],
	},
	{
		m: "linear two path",
		d: "M5,7 10,20 30,40 z M100,100",
		o: [
			[
				[5, 7],
				[10, 20],
				[30, 40],
				[5, 7],
			],
			[[100, 100]],
		],
		closed: [true, false],
	},
	{
		m: "linear two path with relative",
		d: "M5,7 10,20 30,40 V10 H20 v-10 h-10z m5,2 l5,5 5,5",
		o: [
			[
				[5, 7],
				[10, 20],
				[30, 40],
				[30, 10],
				[20, 10],
				[20, 0],
				[10, 0],
				[5, 7],
			],
			[
				[10, 9],
				[15, 14],
				[20, 19],
			],
		],
		closed: [true, false],
	},
	{
		m: "unsplit curve",
		d: "M5,15 c5.5,0 10-4.5 10,-10 h10",
		o: [
			[
				[5, 15],
				[12.0625, 12.0625],
				[15, 5],
				[25, 5],
			],
		],
		closed: [false],
		tolerance: 1000,
	},
	{
		m: "default curve split",
		d: "M5,15 c5.5,0 10-4.5 10,-10 h10",
		o: [
			[
				[5, 15],
				[7, 14.8],
				[10.6, 13.3],
				[13.3, 10.6],
				[14.8, 7],
				[15, 5],
				[25, 5],
			],
		],
		closed: [false],
		decimals: 1,
	},
	{
		m: "degenerate curve",
		d: "M0,0 c0,0 0,0 0,0",
		o: [
			[
				[0, 0],
				[0, 0],
			],
		],
		closed: [false],
	},
];

/**
 * Prevent failures due to floating-point precision loss
 */
function closeTo(
	expected: number[],
	received: number[],
	precision = 6,
): boolean {
	return expected.every(
		(value, index) =>
			Math.abs(value - received[index]) < Math.pow(10, -precision),
	);
}

describe("svgPathToPolygons", () => {
	expectations.forEach((ex) => {
		it(`${ex.m}: correct polygons and closure`, () => {
			const result = svgPathToPolygons(ex.d, {
				tolerance: ex.tolerance,
				decimals: ex.decimals,
			});

			// Test polygon output
			expect(result).toSatisfy((res: (typeof result)[0]) =>
				res.every((points, idx) => closeTo(points.flat(), ex.o[idx].flat())),
			);

			// Test closed property
			expect(result.map((poly) => !!poly.closed)).toEqual(ex.closed);
		});
	});

	it("throws an error for invalid input", () => {
		expect(() => svgPathToPolygons("invalid path")).toThrow();
	});

	it("handles empty path data gracefully", () => {
		const result = svgPathToPolygons("");
		expect(result).toEqual([]);
	});
});
