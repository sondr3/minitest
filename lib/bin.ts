#!/usr/bin/env node

import { promises as fs } from "node:fs";
import { basename, join } from "node:path";

interface CliOptions {
  dir: string;
  quiet?: boolean;
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

const ignoreFile = (file: string): boolean => {
  return basename(file) !== "test.js" || !file.endsWith(".test.js");
};

async function* walkDir(dir: string): AsyncGenerator<string> {
  for await (const d of await fs.opendir(dir)) {
    const entry = join(dir, d.name);

    if (d.isDirectory() && !ignoreDir(d.name)) {
      yield* walkDir(entry);
    } else if (d.isFile() && !ignoreFile(entry)) {
      yield entry;
    }
  }
}

async function run({ dir }: CliOptions): Promise<void> {
  if ((await fs.stat(dir)).isFile()) {
    console.log("running file");
  }

  for await (const file of walkDir(dir)) {
    console.log(file);
  }
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
