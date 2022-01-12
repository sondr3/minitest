## v0.1.1

> 2022-01-12

### Commits

- [[`e532ab0`](https://github.com/sondr3/minitest.git)] Set NODE_ENV to 'test' in runner
- [[`0801c34`](https://github.com/sondr3/minitest.git)] Update @sondr3/prettier, fix formatting

## 0.1.0

> 2022-01-07

## Summary

Initial release of a `minitest`, a low-feature, dependency-free and performant test runner inspired by Rust and Deno.

### Commits

- [[`f92b97e`](https://github.com/sondr3/minitest/commit/f92b97ed83)] Create mjs_test.mjs to verify testing mjs files work
- [[`8a605cb`](https://github.com/sondr3/minitest/commit/8a605cbd9b)] Add TSDocs to test function
- [[`e3d7ff1`](https://github.com/sondr3/minitest/commit/e3d7ff15ab)] Only export the test function from the library
- [[`264e4ba`](https://github.com/sondr3/minitest/commit/264e4ba8fd)] Explicitly include and exclude files in tsconfig
- [[`d4e8a44`](https://github.com/sondr3/minitest/commit/d4e8a448f8)] Add tests based on code coverage
- [[`2780e6a`](https://github.com/sondr3/minitest/commit/2780e6ae67)] Add c8 for code coverage
- [[`6cf6f3f`](https://github.com/sondr3/minitest/commit/6cf6f3f276)] Mention c8 for code coverage
- [[`d52ad92`](https://github.com/sondr3/minitest/commit/d52ad9219c)] Add keywords, update headline and add more documentation
- [[`95e5b31`](https://github.com/sondr3/minitest/commit/95e5b313b0)] Update README [ci skip]
- [[`4c1eb26`](https://github.com/sondr3/minitest/commit/4c1eb26ff5)] Change test output to look closer to cargo test
- [[`7c66e4f`](https://github.com/sondr3/minitest/commit/7c66e4f14b)] Implement fail-fast
- [[`8c95516`](https://github.com/sondr3/minitest/commit/8c9551601c)] Update documentation
- [[`65125a3`](https://github.com/sondr3/minitest/commit/65125a3861)] Update types ever so slightly
- [[`e53b1d8`](https://github.com/sondr3/minitest/commit/e53b1d8d8d)] Update &#x27;lib&#x27; value to match currently supported node versions
- [[`3bdb96a`](https://github.com/sondr3/minitest/commit/3bdb96a900)] Add initial value to reduci in mapSize to fix error on empty maps
- [[`accf2e0`](https://github.com/sondr3/minitest/commit/accf2e0b4e)] Filter out empty tests files when filtering test names
- [[`cb48470`](https://github.com/sondr3/minitest/commit/cb48470c7d)] Skip whole report loop if file has no valid tests
- [[`8bc164e`](https://github.com/sondr3/minitest/commit/8bc164e8b3)] Hide file test count if file has no tests
- [[`ffd81a1`](https://github.com/sondr3/minitest/commit/ffd81a155f)] Refactor test file name matching
- [[`11099c6`](https://github.com/sondr3/minitest/commit/11099c6a65)] Add some tests, refactor to use TestRunner
- [[`b50bf4f`](https://github.com/sondr3/minitest/commit/b50bf4fe23)] Fix counting ignored tests, run tests asynchronously
- [[`7f9b681`](https://github.com/sondr3/minitest/commit/7f9b6810e6)] Export a simple Test class, convert to internal test runner
- [[`e027935`](https://github.com/sondr3/minitest/commit/e027935593)] Strip items marked as internal from public exports
- [[`42c2a3e`](https://github.com/sondr3/minitest/commit/42c2a3e8c0)] Explicitly add &#x27;types&#x27; key in package.json
- [[`e7bec25`](https://github.com/sondr3/minitest/commit/e7bec25b14)] Add some tests for test function
- [[`65fb615`](https://github.com/sondr3/minitest/commit/65fb61575c)] Refactor test runner, implement only/filtering
- [[`2500e5c`](https://github.com/sondr3/minitest/commit/2500e5c7dc)] Fix tests accidentally copying running test CLI options
- [[`52f6a37`](https://github.com/sondr3/minitest/commit/52f6a37630)] Move coloring functionality to utils
- [[`f7b7b59`](https://github.com/sondr3/minitest/commit/f7b7b59730)] Simplify ignoreDir, testFile and results functions
- [[`16558d0`](https://github.com/sondr3/minitest/commit/16558d04f6)] Add test for missing filter string
- [[`37a456d`](https://github.com/sondr3/minitest/commit/37a456d96f)] Fix test runner for single files trying to open it as a folder
- [[`bbc74f7`](https://github.com/sondr3/minitest/commit/bbc74f7e94)] Refactor CLI parsing, add tests
- [[`5862fbe`](https://github.com/sondr3/minitest/commit/5862fbeec3)] Extract CLI to its own file
- [[`54f05d4`](https://github.com/sondr3/minitest/commit/54f05d4e81)] Set eslint envs correctly, engines in package.json
- [[`afaabe1`](https://github.com/sondr3/minitest/commit/afaabe1c6d)] Add version and help flag to CLI
- [[`964e940`](https://github.com/sondr3/minitest/commit/964e9400eb)] Add README
- [[`e073c10`](https://github.com/sondr3/minitest/commit/e073c10048)] Make package more modular, move bin file
- [[`edc21fd`](https://github.com/sondr3/minitest/commit/edc21fd819)] Add colors to test results
- [[`f88c06d`](https://github.com/sondr3/minitest/commit/f88c06d4ea)] Report results via test runner
- [[`4d76b1a`](https://github.com/sondr3/minitest/commit/4d76b1a661)] Add runner, reporting of tests
- [[`4a9b847`](https://github.com/sondr3/minitest/commit/4a9b847cb5)] Convert test function to class
- [[`0cd6a9f`](https://github.com/sondr3/minitest/commit/0cd6a9fb75)] Add back @sondr3/prettier, add .gitattributes/.editorconfig for Windows
- [[`ee3d21c`](https://github.com/sondr3/minitest/commit/ee3d21cb5b)] Use default pretter config
- [[`8156cfc`](https://github.com/sondr3/minitest/commit/8156cfcc91)] Setup matrix tests for Node versions and OS
- [[`0f0da04`](https://github.com/sondr3/minitest/commit/0f0da04343)] Run the found test files
- [[`b8ff858`](https://github.com/sondr3/minitest/commit/b8ff858c7b)] Create directory walker, CLI for binary
- [[`8b19ad5`](https://github.com/sondr3/minitest/commit/8b19ad5aad)] First pass at defining tests
- [[`dd7301b`](https://github.com/sondr3/minitest/commit/dd7301b9ac)] Set binary name, emit declarations
