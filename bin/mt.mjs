#!/usr/bin/env node

import { run, parseCli } from "../dist/runner.js";

run(parseCli(process.argv));
