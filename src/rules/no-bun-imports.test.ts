import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";

import { rule } from "./no-bun-imports";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester();

ruleTester.run("no-bun-imports", rule, {
	valid: [
		'import fs from "node:fs";',
		'import { ESLintUtils } from "@typescript-eslint/utils";',
		'import * as React from "react";',
	],
	invalid: [
		{
			code: 'import { sql } from "bun";',
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'import { Database } from "bun:sqlite";',
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'import { dlopen, FFIType, suffix } from "bun:ffi";',
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'import { expect, test } from "bun:test";',
			errors: [{ messageId: "noBunImports" }],
		},
	],
});
