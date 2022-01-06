import { strict as assert } from "node:assert";

import { test } from "./index.js";

// yo, i heard you like tests, so i put tests in your tests

test("object only", () => {
  const it = test({
    name: "has name",
    fn: () => {
      /* */
    },
  });

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
  });
  assert.equal(it.name, "unnamed");
});

test("named function only", () => {
  const it = test(function thisHasAName() {
    /* */
  });
  assert.equal(it.name, "thisHasAName");
});
