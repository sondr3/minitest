import type { TestFn } from "./test_fn.js";
import { color } from "./utils.js";

export class TestRunner {
	readonly name: string;
	readonly fn: TestFn;
	readonly ignore: boolean = false;
	readonly only: boolean = false;
	success = false;
	error: Error | undefined = undefined;

	constructor(name: string, fn: TestFn, ignore: boolean, only: boolean) {
		this.name = name;
		this.fn = fn;
		this.ignore = ignore;
		this.only = only;
	}

	async run(): Promise<boolean> {
		if (this.ignore) {
			this.success = true;
			return this.success;
		}

		try {
			await this.fn();
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
		} else if (this.success) {
			this.report(".", color("ok", "green"), quiet);
		} else {
			this.report("F", color("FAILED", "red"), quiet);
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
