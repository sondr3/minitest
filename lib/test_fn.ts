import { TESTS } from "./runner.js";
import { TestRunner } from "./test_runner.js";

export interface TestDefinition {
  name: string;
  fn: TestFn;
  // Ignore this test, skipping it and run the test suite as if it doesn't exist.
  ignore?: boolean;
  // Ignores all tests that do not have the `only` flag and fails the test suite.
  only?: boolean;
}

export type TestFn = () => void | Promise<void>;
type TestNoFn = Omit<TestDefinition, "fn">;
type TestOptions = Pick<TestDefinition, "ignore" | "only">;

const isTestDefinition = (object: unknown): object is TestDefinition => {
  return object !== null && typeof object === "object" && "name" in object && "fn" in object;
};

export class Test {
  private readonly name!: string;
  private readonly fn!: TestFn;
  private _ignore = false;
  private _only = false;

  constructor(fnNameOrOpts: TestDefinition | TestFn | TestNoFn | string, fn?: TestFn, opts?: TestOptions) {
    if (typeof fnNameOrOpts === "function") {
      const name = fnNameOrOpts.name === "" ? "unnamed" : fnNameOrOpts.name;
      this.name = name;
      this.fn = fnNameOrOpts;
      this._ignore = opts?.ignore ?? false;
      this._only = opts?.only ?? false;
    } else if (typeof fnNameOrOpts === "string") {
      if (!fn || typeof fn !== "function") {
        throw new Error("Test is missing function");
      }

      this.name = fnNameOrOpts;
      this.fn = fn;
      this._ignore = opts?.ignore ?? false;
      this._only = opts?.only ?? false;
    } else if (typeof fnNameOrOpts === "object") {
      if (!fnNameOrOpts.name) {
        throw new Error("Test must have a name");
      }

      if (isTestDefinition(fnNameOrOpts)) {
        if (fn || typeof fn === "function") {
          throw new Error("Test has two test functions");
        }

        this.name = fnNameOrOpts.name;
        this.fn = fnNameOrOpts.fn;
        this._ignore = fnNameOrOpts.ignore ?? false;
        this._only = fnNameOrOpts.only ?? false;
      } else {
        if (!fn) {
          throw new Error("Test is missing function");
        }

        this.name = fnNameOrOpts.name;
        this.fn = fn;
        this._ignore = fnNameOrOpts.ignore ?? false;
        this._only = fnNameOrOpts.only ?? false;
      }
    } else {
      throw new Error("Misformed test definition");
    }

    TESTS.push(this);
  }

  /** Mark the test as ignored */
  ignore(): void {
    this._ignore = true;
  }

  /** Only run this test */
  only(): void {
    this._only = true;
  }

  /** @internal */
  toTestRunner(): TestRunner {
    return new TestRunner(this.name, this.fn, this._ignore, this._only);
  }
}

export function test(fn: TestFn): Test;
export function test(t: TestDefinition): Test;
export function test(opts: TestNoFn, fn: TestFn): Test;
export function test(name: string, fn: TestFn): Test;
export function test(name: string, fn: TestFn, options?: TestOptions): Test;
export function test(fnNameOrOpts: TestDefinition | TestFn | TestNoFn | string, fn?: TestFn, opts?: TestOptions): Test {
  return new Test(fnNameOrOpts, fn, opts);
}
