import { createRequire } from "node:module";

export interface CliOptions {
  dir: string;
  help: boolean;
  version: boolean;
  quiet: boolean;
  filter?: (name: string) => boolean;
}

export const defaultOptions: CliOptions = {
  dir: ".",
  help: false,
  version: false,
  quiet: false,
  filter: undefined,
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

const printVersionHelp = (version: boolean, help: boolean) => {
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
};

export const parseOptions = (args: Array<string>, options: CliOptions): CliOptions => {
  if (args.length === 0) return options;

  if (args[0].startsWith("-")) {
    switch (args[0]) {
      case "-q":
      case "--quiet":
        options.quiet = true;
        return parseOptions(args.slice(1), options);
      case "-v":
      case "--version":
        options.version = true;
        return options;
      case "-h":
      case "--help":
        options.help = true;
        return options;
      case "-f":
      case "--filter": {
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
        return parseOptions(args.slice(2), options);
      }
      default:
        return options;
    }
  } else {
    options.dir = args[0];
    return parseOptions(args.slice(1), options);
  }
};

export const parseCli = (argv: Array<string>): CliOptions => {
  const args = argv.slice(2);
  const options = parseOptions(args, defaultOptions);

  if (options.version || options.help) {
    printVersionHelp(options.version, options.help);
  }

  return options;
};
