import { strict as assert } from "node:assert"

import { test } from "./index.js"
import { mapSize } from "./utils.js"

test("mapSize()", () => {
	const maps: Array<[Map<string, Array<number>>, number]> = [
		[
			new Map([
				["a", [1]],
				["b", [3]],
			]),
			2,
		],
		[new Map(), 0],
	]

	for (const [map, size] of maps) assert.equal(mapSize(map), size)
})
