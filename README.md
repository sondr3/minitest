<h1 align="center">minitest</h1>
<p align="center">
    <a href="https://github.com/sondr3/minitest/actions"><img alt="GitHub Actions Status" src="https://github.com/sondr3/minitest/workflows/pipeline/badge.svg" /></a>
    <a href="https://www.npmjs.com/package/@sondr3/minitest"><img alt="NPM" src="https://badge.fury.io/js/%40sondr3%2Fminitest.svg" /></a>
</p>

<p align="center">
    <b>A low-feature and performant test runner inspired by Rust and Deno</b>
</p>

- **Simplicity**: Use the `mt` test runner with the `test` function, nothing more.
- **Performance**: By doing less we can run more faster.
- **Minimal**: Bring your own assertions, snapshots, `mt` will never be more than it is.

<details>
<summary>Table of Contents</summary>
<br />

## Table of Contents

- [Quickstart](#quickstart)
- [Getting started](#getting-started)
- [License](#license)
</details>

# Quickstart

1. Install via `npm`/`yarn`/`pnpm`: `yarn add --dev @sondr3/minitest`
2. Add a test script to `package.json`: `"test": "mt <dir>"`
3. Write your tests, any file ending with `.test.js` or named `test.js` are valid:

   ```js
   import { strict as assert } from "assert";
   import { test } from "@sondr3/minitest";

   test("it works!", () => {
     assert(true === true, "Phew");
   });
   ```

4. Run your tests: `yarn test`

   ```text
   running 1 test
   running 1 test in dir/index.test.js
   test  it works! ... ok

   test result: ok. 1 passed; 0 failed; 0 ignored; 0 filtered out; finished in 32ms
   ```

# Getting started

TODO

# License

MIT.
