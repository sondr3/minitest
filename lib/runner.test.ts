import { strict as assert } from "node:assert";

import { test } from "./index.js";
import { testFile } from "./runner.js";

test("testFile() correctly matches", () => {
  const testFiles = ["test.js", "test.mjs", "cli.test.js", "cli.test.mjs", "cli_test.js", "cli_test.mjs"];
  testFiles.forEach((f) => assert(testFile(f), `${f} should be a valid test file`));
});

test("testFile() ignores incorrect files", () => {
  const errors = ["test.ts", "test.cli.js.map", "test_cli.mjs.map"];
  errors.forEach((f) => assert(!testFile(f), `${f} should NOT be a valid test file`));
});
