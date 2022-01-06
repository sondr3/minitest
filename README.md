<h1 align="center">minitest</h1>
<p align="center">
    <a href="https://github.com/sondr3/minitest/actions"><img alt="GitHub Actions Status" src="https://github.com/sondr3/minitest/workflows/pipeline/badge.svg" /></a>
    <a href="https://www.npmjs.com/package/@sondr3/minitest"><img alt="NPM" src="https://badge.fury.io/js/%40sondr3%2Fminitest.svg" /></a>
</p>

<p align="center">
    <b>A low-feature and performant test runner inspired by Rust and Deno</b>
</p>

- **Simplicity**: Use the `mt` test runner with the `test` function, nothing more.
- **Performance**: By doing less we can run more quick.
- **Minimal**: Bring your own assertions, snapshots, `mt` will never be more than it is.

<details>
<summary>Table of Contents</summary>
<br />

## Table of Contents

- [Quickstart](#quickstart)
- [Getting started](#getting-started)
  - [Finding tests](#finding-tests)
  - [Writing tests](#writing-tests)
  - [Running tests](#running-tests)
  - [Filtering](#filtering)
- [License](#license)
</details>

# Quickstart

1. Install via your tool of choice: `pnpm add --dev @sondr3/minitest`
2. Add a test script to `package.json`:

   ```json
     "scripts": {
       "test": "mt <dir>",
     },
   ```

3. Write your tests:

   ```js
   import { strict as assert } from "assert";
   import { test } from "@sondr3/minitest";

   test("it works!", () => {
     assert(true === true, "Phew");
   });
   ```

4. Run your tests: `pnpm test`

   ```text
   running 1 test
   running 1 test in dir/index.test.js
   test  it works! ... ok

   test result: ok. 1 passed; 0 failed; 0 ignored; 0 filtered out; finished in 32ms
   ```

# Getting started

## Finding tests

`mt` will recursively look for files in your current directory:

- named `test.{js,mjs}`,
- or ending in `.test.{js,mjs}`
- or ending in `_test.{js,mjs}`

## Writing tests

To write tests you need to import the `test` function from `@sondr3/minitest`. There
are a couple of different styles that can be used to write tests, but we'll get
into these later.

```js
import { test } from "@sondr3/minitest";
import { strict as assert } from "node:assert";

test("hello world #1", () => {
  const x = 1 + 2;
  assert.equal(x, 3);
});

test({ name: "hello world #2" }, () => {
  const x = 1 + 2;
  assert.equal(x, 3);
});
```

### Async functions

You can also test asynchronous code by turning the test function into a function
that returns a promise. Simply add `async` in front of the function:

```js
import { test } from "@sondr3/minitest";
import { strict as assert } from "node:assert";

test("async hello world", async () => {
  const x = 1 + 2;
  const wait = async () => new Promise((res) => setTimeout(res, 1000));
  await wait();
  assert.equal(x, 3);
});
```

## Running tests

Simply run `mt` to test all test files matching the pattern in [finding tests](#finding-tests), or
point it to the directory or file you want to run:

```shell
# Run all tests in current directory
mt

# Run all tests in the fs directory
mt fs

# Run a single test file
mt fs.test.js
```

## Filtering

There are tree different ways of filtering tests, either by filtering against test
names, skipping tests or running a select subset of tests.

### Filtering via the CLI

Tests can be filtered out by using the `--filter` option. This option accepts
either a case insensitive string or a Regex pattern as its value.

If you have the following tests:

```js
test("a-test", () => {});
test("test-1", () => {});
test("test-2", () => {});
```

You can then filter them by filtering all tests that contain the word `test`:

```shell
mt --filter "test"
```

Or by matching against a Regex pattern:

```shell
mt --filter "/test-*\d/"
```

### Ignoring (skipping)

If you want to ignore/skip tests based on some boolean condition or because they
are currently incorrect you can use the `ignore()` method or the `ignore` field
in the options:

```js
test("ignored", () => {}).ignore(); // or .ignore(condition)
test({ name: "other ignored", ignore: process.arch === "x64" }, () => {});
test("final ignored", () => {}, { ignore: true });
```

### Running specific tests

Sometimes you may want to only run a subset of your tests because you are working
on a problem where you want to ignore tests not relevant to it. To do this you can
mark tests using the `only()` method or the `only` field in the options, and only
these tests are run. While these tests will run normally and report success and
failure normally, the whole test suite will still fail as using `only` should only
be a temporary measure as it disables nearly the whole test suite.

```js
test("other ignored", () => {}).only();
test({ name: "ignored", only: true }, () => {});
test("final ignored", () => {}, { only: true });
```

# License

MIT.
