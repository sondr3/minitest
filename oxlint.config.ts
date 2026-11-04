import config from "@sondr3/oxlint"
import { defineConfig } from "oxlint"

export default defineConfig({
	extends: [config],
	rules: {
		// test files use the `*_test.ts` convention that the runner supports
		"unicorn/filename-case": "off",
		// this is a Node CLI, it needs process.env and process.exit
		"node/no-process-env": "off",
		"unicorn/no-process-exit": "off",
		"eslint/complexity": "off",
		"eslint/no-undefined": "off",
		"eslint/no-underscore-dangle": "off",
		"import/no-relative-parent-imports": "off",
		"oxc/no-optional-chaining": "off",
		"typescript/explicit-member-accessibility": "off",
	},
	overrides: [
		{
			files: ["*.config.ts"],
			rules: { "import/no-default-export": "off" },
		},
	],
})
