import { strict as assert } from "node:assert";

import { defaultOptions, parseOptions } from "./cli.js";
import { test } from "./index.js";

test("CLI without options", () => {
  const options = parseOptions([], { ...defaultOptions });

  assert(!options.quiet);
  assert(!options.help);
  assert(!options.version);

  assert.equal(options.dir, ".");
  assert.equal(options.filter, undefined);
});

test("CLI with options, no dir", () => {
  const options = parseOptions(["-q"], { ...defaultOptions });

  assert(options.quiet);
  assert(!options.help);
  assert(!options.version);

  assert.equal(options.dir, ".");
  assert.equal(options.filter, undefined);
});

test("CLI with dir", () => {
  const options = parseOptions(["dir"], { ...defaultOptions });
  assert.equal(options.dir, "dir");
});

test("CLI with filter", () => {
  const options = parseOptions(["-f", "filter"], { ...defaultOptions });
  assert.equal(typeof options.filter, "function");
});

test("CLI with options and dir", () => {
  const options = parseOptions(["-q", "dist/", "-f", "filter"], { ...defaultOptions });

  assert(options.quiet);
  assert(!options.help);
  assert(!options.version);

  assert.equal(options.dir, "dist/");
  assert.equal(typeof options.filter, "function");
});

test("CLI with version stops parsing", () => {
  const options = parseOptions(["--version", "-q"], { ...defaultOptions });

  assert(!options.quiet);
  assert(options.version);
});

test("CLI with help short circuits", () => {
  const options = parseOptions(["--help", "-v"], { ...defaultOptions });

  assert(options.help);
  assert(!options.version);
});

test("CLI filtering without value throws", () => {
  assert.throws(() => parseOptions(["dist/", "-f"], { ...defaultOptions }));
});
