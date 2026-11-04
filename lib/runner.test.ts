import { strict as assert } from "node:assert"
import path from "node:path"

import { test } from "./index.js"
import { ignoreDir, testFile, walkDir } from "./runner.js"

const walkDirToArray = async (dir: string): Promise<Array<string>> => {
	const out = []
	for await (const x of walkDir(dir)) out.push(x)
	return out
}

test("testFile() correctly matches", () => {
	const testFiles = ["test.js", "test.mjs", "cli.test.js", "cli.test.mjs", "cli_test.js", "cli_test.mjs"]
	for (const f of testFiles) assert(testFile(f), `${f} should be a valid test file`)
})

test("testFile() ignores incorrect files", () => {
	const errors = ["test.ts", "test.cli.js.map", "test_cli.mjs.map"]
	for (const f of errors) assert(!testFile(f), `${f} should NOT be a valid test file`)
})

test("ignoreDir()", () => {
	const dirs = ["node_modules", ".git", ".github", ".."]
	for (const d of dirs) assert(ignoreDir, `${d} should not be a valid dir`)
})

test("walkDir()", async () => {
	const files = await walkDirToArray(`${process.cwd()}/dist`)
	assert(files.some((f) => path.basename(f) === "cli.test.js"))
	assert(files.some((f) => path.basename(f) === "test.test.js"))
	assert(files.some((f) => path.basename(f) === "examples_test.js"))
})
