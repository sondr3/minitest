import { promises as fs } from "node:fs";
import { basename, join } from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";

import { parseCli } from "./cli.js";
import { Test } from "./test_fn.js";
import { color } from "./utils.js";

export const tests: Map<string, Array<Test>> = new Map();

const ignoreDir = (dir: string): boolean => dir === "node_modules" || dir.startsWith(".");
const testFile = (file: string): boolean => basename(file) === "test.js" || file.endsWith(".test.js");

async function* walkDir(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = join(dir, d.name);

    if (d.isDirectory() && !ignoreDir(d.name)) {
      yield* walkDir(entry);
    } else if (d.isFile() && testFile(entry)) {
      yield entry;
    }
  }
}

function report(quiet: boolean): void {
  const count = Array.from(tests.values()).reduce((prev, it) => prev + it.length, 0);
  process.stdout.write(`running ${count} ${count === 1 ? "test" : "tests"}\n`);
  for (const [file, xs] of tests.entries()) {
    if (!quiet) {
      process.stdout.write(`running ${xs.length} ${xs.length === 1 ? "test" : "tests"} in ${file}\n`);
    }
    xs.forEach((test) => test.result(quiet));
  }

  const { ok, failed, ignored } = results();

  const success = failed > 0 ? color("FAILED", "red") : color("ok", "green");
  const time = performance.now().toFixed(0);

  process.stdout.write(
    `\ntest result: ${success}. ${ok} passed; ${failed} failed; ${ignored} ignored; 0 filtered out; finished in ${time}ms\n\n`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

function results(): { ok: number; failed: number; ignored: number } {
  const start = { ok: 0, failed: 0, ignored: 0 };
  return Array.from(tests.values()).reduce((prev, cur) => {
    prev.ignored += cur.filter((t) => t.ignore).length;
    prev.ok += cur.filter((t) => t.success).length;
    prev.failed += cur.filter((t) => !t.success).length;

    return prev;
  }, start);
}

export async function run(argv: Array<string>): Promise<void> {
  const { dir, quiet } = parseCli(argv);

  if ((await fs.stat(dir)).isFile()) {
    await import(pathToFileURL(dir).toString());
    tests.set(dir, tests.get("unnamed") ?? []);
    tests.delete("unnamed");
  } else {
    for await (const file of walkDir(dir)) {
      await import(pathToFileURL(file).toString());
      tests.set(file, tests.get("unnamed") ?? []);
      tests.delete("unnamed");
    }
  }

  report(quiet);
}
