import { strict as assert } from "node:assert";

import { test } from "./index.js";
import { mapSize } from "./utils.js";

test("mapSize()", () => {
	const maps: Array<[Map<string, Array<number>>, number]> = [
		[
			new Map([
				["a", [1]],
				["b", [3]],
			]),
			2,
		],
		// because ESLint has terrible type inference >:(
		[new Map() as Map<string, Array<number>>, 0],
	];

	maps.forEach(([map, size]) => assert.equal(mapSize(map), size));
});
