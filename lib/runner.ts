import { promises as fs } from "node:fs";
import { join, parse } from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";

import { parseCli, printVersionHelp } from "./cli.js";
import { Test } from "./test_fn.js";
import { TestRunner } from "./test_runner.js";
import { color, mapSize } from "./utils.js";

export const TESTS: Array<Test> = [];

export const ignoreDir = (dir: string): boolean => dir === "node_modules" || dir.startsWith(".");
const testExt = (ext: string) => ext === ".js" || ext === ".mjs";
export const testFile = (file: string): boolean => {
  const { name, ext } = parse(file);
  return testExt(ext) && (name === "test" || name.endsWith(".test") || name.endsWith("_test"));
};

export async function* walkDir(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = join(dir, d.name);

    if (d.isDirectory() && !ignoreDir(d.name)) {
      yield* walkDir(entry);
    } else if (d.isFile() && testFile(d.name)) {
      yield entry;
    }
  }
}

class Runner {
  private readonly quiet;
  private readonly failFast?: number;
  private readonly filterFn!: (name: string) => boolean;
  private readonly filter: boolean = false;
  private failures: Array<[string, Error | undefined]> = [];
  private tests: Map<string, Array<TestRunner>> = new Map();
  private only = false;
  private ok = 0;
  private failed = 0;
  private ignored = 0;
  private filtered = 0;

  constructor(quiet: boolean, failFast?: number, filter?: (name: string) => boolean) {
    this.quiet = quiet;
    this.failFast = failFast;

    if (filter) {
      this.filterFn = filter;
      this.filter = true;
    }
  }

  async run(entry: string) {
    await this.collect(entry);
    this.filterTestsMarkedOnly();

    if (this.filter) {
      this.filterTests();
    }

    await this.runTests();
  }

  report(): void {
    const time = performance.now().toFixed(0);
    const success = this.failed > 0 ? color("FAILED", "red") : color("ok", "green");

    if (this.failed) {
      process.stdout.write(`\n\nfailures:\n`);
      this.failures
        .filter(([, err]) => err)
        .forEach(([name, err]) => {
          process.stdout.write(`\n---- ${name} message ----\n`);
          if (err?.stack) {
            process.stdout.write(err.stack);
          } else {
            process.stdout.write(err?.message ?? "");
          }
          process.stdout.write(`\n`);
        });
      process.stdout.write(`\n\nfailures:\n`);
      this.failures.forEach(([name]) => process.stdout.write(`\t${name}\n`));
      process.stdout.write(`\n`);
    }

    process.stdout.write(
      `\ntest result: ${success}. ${this.ok} passed; ${this.failed} failed; ${this.ignored} ignored; ${this.filtered} filtered out; finished in ${time}ms\n\n`,
    );

    if (this.failed > 0 || this.only) {
      process.exit(1);
    }
  }

  private async collect(entry: string) {
    if ((await fs.stat(entry)).isFile()) {
      await import(pathToFileURL(entry).toString());
      this.addTests(entry);
    } else {
      for await (const file of walkDir(entry)) {
        await import(pathToFileURL(file).toString());
        this.addTests(file);
      }
    }
  }

  private addTests(entry: string) {
    this.tests.set(
      entry,
      TESTS.splice(0).map((t) => t.toTestRunner()),
    );
  }

  private filterTestsMarkedOnly() {
    const onlyTests: Map<string, Array<TestRunner>> = new Map();
    for (const [file, tests] of this.tests.entries()) {
      if (tests.some((t) => t.only)) {
        const onlies = tests.filter((t) => t.only);
        this.only = true;
        onlyTests.set(file, onlies);
      }
    }

    if (this.only) {
      this.tests = onlyTests;
    }
  }

  private async runTests() {
    const count = Array.from(this.tests.values()).reduce((prev, it) => prev + it.length, 0);
    process.stdout.write(`running ${count} ${count === 1 ? "test" : "tests"}\n`);

    for (const [file, xs] of this.tests.entries()) {
      if (!this.quiet) {
        process.stdout.write(`running ${xs.length} ${xs.length === 1 ? "test" : "tests"} in ${file}\n`);
      }

      for (const test of xs) {
        const res = await test.run();
        if (test.ignore) {
          this.ignored += 1;
        } else if (res) {
          this.ok += 1;
        } else {
          this.failed += 1;
          this.failures.push([test.name, test.error]);
        }

        test.result(this.quiet);

        if (this.shouldFail()) {
          return;
        }
      }
    }
  }

  private shouldFail(): boolean {
    if (this.failFast === undefined) return false;

    return this.failed > this.failFast;
  }

  private filterTests() {
    const filtered: Array<[string, Array<TestRunner>]> = Array.from(this.tests.entries()).flatMap(([file, xs]) => {
      const filtered = xs.filter((t) => this.filterFn(t.name));
      return filtered.length > 0 ? [[file, filtered]] : [];
    });
    const tests: Map<string, Array<TestRunner>> = new Map(filtered);
    this.filtered = mapSize(this.tests) - mapSize(tests);
    this.tests = tests;
  }
}

export async function run(argv: Array<string>): Promise<void> {
  const { dir, quiet, filter, failFast, version, help } = parseCli(argv);

  if (version || help) {
    printVersionHelp(version, help);
    process.exit(0);
  }

  const runner = new Runner(quiet, failFast, filter);

  await runner.run(dir);
  runner.report();
}
