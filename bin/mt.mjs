#!/usr/bin/env node

import { run } from "../dist/runner.js"

process.env.NODE_ENV = "test"

// unhandled rejections crash the process with a stack trace, which is what we want
// oxlint-disable-next-line typescript/no-floating-promises
run(process.argv)
