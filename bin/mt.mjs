#!/usr/bin/env node

import { run } from "../dist/runner.js";

process.env.NODE_ENV = "test";

run(process.argv);
