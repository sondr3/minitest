import { strict as assert } from "node:assert";

import { test } from "../index.js";

test("hello world #1", () => {
	const x = 1 + 2;
	assert.equal(x, 3);
});

test({ name: "hello world #2" }, () => {
	const x = 1 + 2;
	assert.equal(x, 3);
});

test("async hello world", async () => {
	const x = 1 + 2;
	const wait = async () => new Promise((res) => setTimeout(res, 10));
	await wait();
	assert.equal(x, 3);
});

test("a-test", () => {
	// no-op
});
test("test-1", () => {
	// no-op
});
test("test-2", () => {
	// no-op
});

test("other ignored", () => {
	// no-op
}).ignore();

test({ name: "ignored", ignore: process.arch === "x64" }, () => {
	// no-op
});

test(
	"final ignored",
	() => {
		// no-op
	},
	{ ignore: true },
);
