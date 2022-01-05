import { promises as fs } from "node:fs";
import { createRequire } from "node:module";
import { basename, join } from "node:path";
import { performance } from "node:perf_hooks";
import { pathToFileURL } from "node:url";

import { Test } from "./test_fn.js";

const USE_COLORS = process.env["NO_COLOR"] !== undefined;

const colors = {
  reset: 0,
  red: 31,
  green: 32,
  yellow: 33,
};

const HELP = (version: string) => `minitest v${version}
A low-feature and performant test runner inspired by Rust and Deno

USAGE:
\tmt <dir> [flags]

OPTIONS:
\t-q, --quiet\t\t Quiet output
\t-f, --filter=<filter>\t Filter tests by name, accepts regex
\t-v, --version\t\t Print version
\t-h, --help\t\t Print help
`;

export const color = (str: string, color: "red" | "green" | "yellow") => {
  return USE_COLORS ? str : `\x1b[${colors[color]}m${str}\x1b[${colors.reset}m`;
};

export const tests: Map<string, Array<Test>> = new Map();

interface CliOptions {
  dir: string;
  help: boolean;
  version: boolean;
  quiet: boolean;
  filter?: (name: string) => boolean;
}

const defaultOptions: CliOptions = {
  dir: ".",
  help: false,
  version: false,
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
  const res = { ok: 0, failed: 0, ignored: 0 };
  for (const val of tests.values()) {
    res.ignored += val.filter((t) => t.ignore).length;
    res.ok += val.filter((t) => t.success).length;
    res.failed += val.length - res.ok;
  }

  return res;
}

export function parseCli(argv: Array<string>): CliOptions {
  const args = argv.slice(2);
  const options: CliOptions = defaultOptions;

  if (args.length > 0) {
    options.dir = args[0];
  }

  options.help = args.includes("-h") || args.includes("--help");
  options.version = args.includes("-v") || args.includes("--version");
  options.quiet = args.includes("-q") || args.includes("--quiet");

  if (args.includes("-f") || args.includes("--filter")) {
    const index = args.findIndex((arg) => arg === "-f" || arg === "--filter");
    if (index + 1 >= args.length) {
      throw new Error("Missing filter string");
    }

    const filter = args[index + 1];
    if (filter.startsWith("/") && filter.endsWith("/")) {
      const regex = new RegExp(filter.slice(1, filter.length - 1));
      options.filter = (name: string) => regex.test(name);
    } else {
      options.filter = (name: string) => filter.includes(name);
    }
  }

  return options;
}

function printVersionHelp(version: boolean, help: boolean) {
  const require = createRequire(import.meta.url);
  const data = require("../package.json") as { version: string };

  if (version) {
    process.stdout.write(`minitest v${data.version}\n`);
    process.exit(0);
  }

  if (help) {
    process.stdout.write(HELP(data.version));
    process.exit(0);
  }
}

export async function run({ dir, version, help, quiet }: CliOptions): Promise<void> {
  printVersionHelp(version, help);

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
