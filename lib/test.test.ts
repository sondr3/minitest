// Disable this rule for this file to test erroneous usage of `test`
/* eslint-disable @typescript-eslint/ban-ts-comment */

import { strict as assert } from "node:assert";

import { test } from "./index.js";

// yo, i heard you like tests, so i put tests in your tests

test("ignore() works", () => {
  const it = test("internal", () => {
    // no-op
  });
  it.ignore();
  const runner = it.toTestRunner();

  assert(runner.ignore);
  assert.equal(runner.name, "internal");
});

test("only() works", () => {
  const it = test("only internal", () => {
    // no-op
  });
  it.only();
  const runner = it.toTestRunner();

  assert(!runner.ignore);
  assert(runner.only);
  assert.equal(runner.name, "only internal");
});

test("object only", () => {
  const it = test({
    name: "has name",
    fn: () => {
      /* */
    },
  }).toTestRunner();

  assert.equal(it.name, "has name");
});

test("object without name throws", () => {
  assert.throws(() =>
    // @ts-ignore
    test({
      fn: () => {
        /* */
      },
    }),
  );
});

test("object with two fn throws", () => {
  assert.throws(() =>
    // @ts-ignore
    test(
      {
        name: "oh no",
        fn: () => {
          // no-op
        },
      },
      () => {
        // no-op
      },
    ),
  );
});

test("anonymous function only", () => {
  const it = test(() => {
    /* */
  }).toTestRunner();
  assert.equal(it.name, "unnamed");
});

test("named function only", () => {
  const it = test(function thisHasAName() {
    /* */
  }).toTestRunner();
  assert.equal(it.name, "thisHasAName");
});
