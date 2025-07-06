import { strict as assert } from "node:assert";
import { basename } from "node:path";

import { test } from "./index.js";
import { ignoreDir, testFile, walkDir } from "./runner.js";

const walkDirToArray = async (dir: string): Promise<string[]> => {
	const out = [];
	for await (const x of walkDir(dir)) out.push(x);
	return out;
};

test("testFile() correctly matches", () => {
	const testFiles = ["test.js", "test.mjs", "cli.test.js", "cli.test.mjs", "cli_test.js", "cli_test.mjs"];
	testFiles.forEach((f) => assert(testFile(f), `${f} should be a valid test file`));
});

test("testFile() ignores incorrect files", () => {
	const errors = ["test.ts", "test.cli.js.map", "test_cli.mjs.map"];
	errors.forEach((f) => assert(!testFile(f), `${f} should NOT be a valid test file`));
});

test("ignoreDir()", () => {
	const dirs = ["node_modules", ".git", ".github", ".."];
	dirs.forEach((d) => assert(ignoreDir, `${d} should not be a valid dir`));
});

test("walkDir()", async () => {
	const files = await walkDirToArray(`${process.cwd()}/dist`);
	assert(files.some((f) => basename(f) === "cli.test.js"));
	assert(files.some((f) => basename(f) === "test.test.js"));
	assert(files.some((f) => basename(f) === "examples_test.js"));
});
