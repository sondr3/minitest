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

test("options work", () => {
  const it = test(
    "options",
    () => {
      // no-op
    },
    { only: false, ignore: true },
  ).toTestRunner();

  assert(!it.only);
  assert(it.ignore);
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
  assert.throws(
    () => {
      // @ts-ignore
      test({
        fn: () => {
          /* */
        },
      });
    },
    {
      message: "Test must have a name",
    },
  );
});

test("object without fn throws", () => {
  assert.throws(
    () => {
      // @ts-ignore
      test("help me");
    },
    {
      message: "Test is missing function",
    },
  );
  assert.throws(
    () => {
      // @ts-ignore
      test("help me", { nope: true });
    },
    {
      message: "Test is missing function",
    },
  );
});

test("object with two fn throws", () => {
  assert.throws(
    () => {
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
      );
    },
    {
      message: "Test has two test functions",
    },
  );
});

test("malformed test", () => {
  assert.throws(
    () => {
      // @ts-ignore
      test();
    },
    {
      message: "Misformed test definition",
    },
  );
});

test("test with object without both fns", () => {
  assert.throws(
    () => {
      // @ts-ignore
      test({ name: "nothing to see here" });
    },
    {
      message: "Test is missing function",
    },
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
