#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { basename, join } from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";

import { Test } from "./index.js";

export const tests: Map<string, Array<Test>> = new Map();

interface CliOptions {
  dir: string;
  quiet: boolean;
  filter?: (name: string) => boolean;
}

const defaultOptions: CliOptions = {
  dir: ".",
  quiet: false,
  filter: undefined,
};

const ignoreDir = (dir: string): boolean => {
  if (dir === "node_modules") return true;
  else if (dir.startsWith(".")) return true;

  return false;
};

const testFile = (file: string): boolean => {
  return basename(file) === "test.js" || file.endsWith(".test.js");
};

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

async function run({ dir, quiet }: CliOptions): Promise<void> {
  if ((await fs.stat(dir)).isFile()) {
    await import(pathToFileURL(dir).toString());
    tests.set(dir, tests.get("unnamed") ?? []);
    tests.delete("unnamed");
  }

  for await (const file of walkDir(dir)) {
    await import(pathToFileURL(file).toString());
    tests.set(file, tests.get("unnamed") ?? []);
    tests.delete("unnamed");
  }

  report(quiet);
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

  process.stdout.write(
    `\ntest result: ok. ${ok} passed; ${failed} failed; ${ignored} ignored; 0 filtered out; finished in ${performance
      .now()
      .toFixed(0)}ms\n\n`,
  );

  if (failed > 0) {
    process.exit(1);
  }
}

function results(): { ok: number; failed: number; ignored: number } {
  const res = { ok: 0, failed: 0, ignored: 0 };
  for (const val of tests.values()) {
    res.ignored += val.filter((t) => t.ignore).length;
    res.ok += val.filter((t) => t.success).length;
    res.failed += val.length - res.ok;
  }

  return res;
}

function parseCli(argv: Array<string>): CliOptions {
  const options: CliOptions = {
    ...defaultOptions,
  };

  if (argv.length > 2) {
    options.dir = argv[2];
  }

  if (argv.includes("-q") || argv.includes("--quiet")) {
    options.quiet = true;
  }
  if (argv.includes("-f") || argv.includes("--filter")) {
    const index = argv.findIndex((arg) => arg === "-f" || arg === "--filter");
    if (index >= argv.length) {
      throw new Error("Missing filter string");
    }

    const filter = argv[index + 1];
    if (filter.startsWith("/") && filter.endsWith("/")) {
      const regex = new RegExp(filter.slice(1, filter.length - 1));
      options.filter = (name: string) => regex.test(name);
    } else {
      options.filter = (name: string) => filter.includes(name);
    }
  }

  return options;
}

void run(parseCli(process.argv));
