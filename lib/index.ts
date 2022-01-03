export interface TestDefinition {
  name: string;
  fn: TestFn;
  ignore?: boolean;
  only?: boolean;
}

type TestFn = () => void | Promise<void>;
type TestNoFn = Omit<TestDefinition, "fn">;
type TestOptions = Pick<TestDefinition, "ignore" | "only">;

const defaultOptions: TestOptions = {
  ignore: false,
  only: false,
};

export function test(fn: TestFn): void;
export function test(opts: TestNoFn, fn: TestFn): void;

export function test(name: string, fn: TestFn): void;
export function test(name: string, fn: TestFn, options?: TestOptions): void;

export function test(fnNameOrOpts: TestFn | TestNoFn | string, fn?: TestFn, opts?: TestOptions): void {
  let test;

  if (typeof fnNameOrOpts === "function") {
    const name = fnNameOrOpts.name === "" ? "unnamed" : fnNameOrOpts.name;
    test = { fn: fnNameOrOpts, name: name, ...defaultOptions, ...opts };
  } else if (typeof fnNameOrOpts === "string") {
    if (!fn || typeof fn !== "function") {
      throw new Error("Test is missing function");
    }

    test = { name: fnNameOrOpts, fn: fn, ...defaultOptions, ...opts };
  } else if (typeof fnNameOrOpts === "object") {
    if (!fnNameOrOpts.name) {
      throw new Error("Test must have a name");
    }
    if (!fn || typeof fn !== "function") {
      throw new Error("Test is missing function");
    }

    test = { fn: fn, ...defaultOptions, ...fnNameOrOpts };
  } else {
    throw new Error("Misformed test definition");
  }

  void test.fn();
}
