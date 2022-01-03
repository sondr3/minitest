const tests: Array<TestDefinition> = [];

export const readTests = () => {
  return tests.splice(0);
};

export interface TestDefinition {
  name: string;
  fn: TestFn;
  ignore?: boolean;
  only?: boolean;
}

type TestFn = () => void | Promise<void>;
type TestNoFn = Omit<TestDefinition, "fn">;
type TestOptions = Pick<TestDefinition, "ignore" | "only">;

class Test {
  readonly name!: string;
  readonly fn: TestFn;
  readonly ignore: boolean = false;
  readonly only: boolean = false;

  constructor(fnNameOrOpts: TestFn | TestNoFn | string, fn?: TestFn, opts?: TestOptions) {
    if (typeof fnNameOrOpts === "function") {
      const name = fnNameOrOpts.name === "" ? "unnamed" : fnNameOrOpts.name;
      this.name = name;
      this.fn = fnNameOrOpts;
      Object.assign(this, opts);
    } else if (typeof fnNameOrOpts === "string") {
      if (!fn || typeof fn !== "function") {
        throw new Error("Test is missing function");
      }

      this.name = fnNameOrOpts;
      this.fn = fn;
      Object.assign(this, opts);
    } else if (typeof fnNameOrOpts === "object") {
      if (!fnNameOrOpts.name) {
        throw new Error("Test must have a name");
      }
      if (!fn || typeof fn !== "function") {
        throw new Error("Test is missing function");
      }

      this.fn = fn;
      Object.assign(this, fnNameOrOpts);
    } else {
      throw new Error("Misformed test definition");
    }
  }
}

export function test(fn: TestFn): Test;
export function test(opts: TestNoFn, fn: TestFn): Test;
export function test(name: string, fn: TestFn): Test;
export function test(name: string, fn: TestFn, options?: TestOptions): Test;
export function test(fnNameOrOpts: TestFn | TestNoFn | string, fn?: TestFn, opts?: TestOptions): Test {
  return new Test(fnNameOrOpts, fn, opts);
}
