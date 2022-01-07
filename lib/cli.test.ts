import { strict as assert } from "node:assert";

import { CliOptions, parseCli, parseOptions } from "./cli.js";
import { test } from "./index.js";

const testOptions: CliOptions = {
  dir: ".",
  help: false,
  version: false,
  quiet: false,
  failFast: undefined,
  filter: undefined,
};

test("CLI without options", () => {
  const options = parseOptions([], { ...testOptions });

  assert(!options.quiet);
  assert(!options.help);
  assert(!options.version);
  assert(!options.failFast);

  assert.equal(options.dir, ".");
  assert.equal(options.filter, undefined);
});

test("CLI with options, no dir", () => {
  const options = parseOptions(["-q"], { ...testOptions });

  assert(options.quiet);
  assert(!options.help);
  assert(!options.version);
  assert(!options.failFast);

  assert.equal(options.dir, ".");
  assert.equal(options.filter, undefined);
});

test("CLI with dir", () => {
  const options = parseOptions(["dir"], { ...testOptions });
  assert.equal(options.dir, "dir");
});

test("CLI with filter", () => {
  const options = parseOptions(["-f", "filter"], { ...testOptions });
  assert.equal(typeof options.filter, "function");
});

test("CLI with options and dir", () => {
  const options = parseOptions(["-q", "dist/", "-f", "filter"], { ...testOptions });

  assert(options.quiet);
  assert(!options.help);
  assert(!options.version);

  assert.equal(options.dir, "dist/");
  assert.equal(typeof options.filter, "function");
});

test("CLI with version stops parsing", () => {
  const options = parseOptions(["--version", "-q"], { ...testOptions });

  assert(!options.quiet);
  assert(options.version);
});

test("CLI with help short circuits", () => {
  const options = parseOptions(["--help", "-v"], { ...testOptions });

  assert(options.help);
  assert(!options.version);
});

test("CLI filtering without value throws", () => {
  assert.throws(() => parseOptions(["dist/", "-f"], { ...testOptions }));
});

test("CLI with fail fast", () => {
  const options = parseOptions(["dist/", "--fail-fast", "5"], { ...testOptions });

  assert.equal(options.dir, "dist/");
  assert.equal(options.failFast, 5);
});

test("CLI kitchensink", () => {
  const options = parseOptions(["-f", "test", "dist/", "--fail-fast", "5"], { ...testOptions });

  assert.equal(options.dir, "dist/");
  assert.equal(typeof options.filter, "function");
  assert.equal(options.failFast, 5);
});

test("CLI with fail fast, no value", () => {
  const options = parseOptions(["-F", "dir"], { ...testOptions });

  assert.equal(options.dir, "dir");
  assert.equal(options.failFast, 0);
});

test("CLI with fail fast, value", () => {
  const options = parseOptions(["--fail-fast", "10"], { ...testOptions });
  assert.equal(options.failFast, 10);
});

test("CLI with fail fast, no value and quiet", () => {
  const options = parseOptions(["dist/", "-F", "-q"], { ...testOptions });

  assert.equal(options.dir, "dist/");
  assert(options.quiet);
  assert.equal(options.failFast, 0);
});

test("CLI with fail fast last, no value", () => {
  const options = parseOptions(["fail", "-F"], { ...testOptions });

  assert.equal(options.dir, "fail");
  assert.equal(options.failFast, 0);
});

test("CLI with version flag", () => {
  assert.doesNotThrow(() => parseCli(["", "", "--version"]));
});

test("CLI with help flag", () => {
  assert.doesNotThrow(() => parseCli(["", "", "-h"]));
});

test("CLI with regex filter", () => {
  const options = parseOptions(["--filter", "/test-*d/"], { ...testOptions });
  assert.equal(typeof options.filter, "function");
});
