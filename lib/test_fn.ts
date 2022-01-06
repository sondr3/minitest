import { TESTS } from "./runner.js";
import { color } from "./utils.js";

export interface TestDefinition {
  name: string;
  fn: TestFn;
  // Ignore this test, skipping it and run the test suite as if it doesn't exist.
  ignore?: boolean;
  // Ignores all tests that do not have the `only` flag and fails the test suite.
  only?: boolean;
}

type TestFn = () => void | Promise<void>;
type TestNoFn = Omit<TestDefinition, "fn">;
type TestOptions = Pick<TestDefinition, "ignore" | "only">;

export class Test {
  readonly name!: string;
  readonly fn!: TestFn;
  readonly ignore: boolean = false;
  readonly only: boolean = false;
  success = false;
  error?: Error = undefined;

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
      if (fn || typeof fn === "function") {
        throw new Error("Test has two test functions");
      }

      Object.assign(this, fnNameOrOpts);
    } else {
      throw new Error("Misformed test definition");
    }

    TESTS.push(this);
  }

  run(): boolean {
    if (this.ignore) {
      this.success = true;
    }

    try {
      void this.fn();
      this.success = true;
    } catch (e) {
      this.success = false;
      this.error = e instanceof Error ? e : undefined;
    }

    return this.success;
  }

  result(quiet = false): void {
    if (this.ignore) {
      this.report("i", color("ignored", "yellow"), quiet);
    }

    if (this.success) {
      this.report(".", color("ok", "green"), quiet);
    } else {
      this.report("F", color("FAILED", "red"), quiet);
      if (this.error?.stack) {
        process.stderr.write(`\n\n${this.error?.stack}\n`);
      } else if (this.error) {
        process.stderr.write(`\n\n${this.error.message}\n`);
      }
    }
  }

  private report(short: string, long: string, quiet: boolean) {
    if (quiet) {
      process.stdout.write(`${short}`);
    } else {
      process.stdout.write(`test  ${this.name} ... ${long}\n`);
    }
  }
}

export function test(fn: TestFn): Test;
export function test(t: TestDefinition): Test;
export function test(opts: TestNoFn, fn: TestFn): Test;
export function test(name: string, fn: TestFn): Test;
export function test(name: string, fn: TestFn, options?: TestOptions): Test;
export function test(fnNameOrOpts: TestFn | TestNoFn | string, fn?: TestFn, opts?: TestOptions): Test {
  return new Test(fnNameOrOpts, fn, opts);
}
