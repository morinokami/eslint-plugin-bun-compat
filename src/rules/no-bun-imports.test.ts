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
		{
			code: 'import { expect, test } from "bun:test";',
			options: [{ allowedModules: ["bun:test"] }],
		},
		{
			code: 'import { sql } from "bun";',
			options: [{ allowedModules: ["bun"] }],
		},
		{
			code: 'import { Database } from "bun:sqlite";',
			options: [{ allowedModules: ["bun:sqlite", "bun:test"] }],
		},
		{
			code: 'import { dlopen } from "bun:ffi";',
			options: [{ allowedModules: ["bun:*"] }],
		},
		{
			code: 'import { expect, test } from "bun:test";',
			options: [{ allowedModules: ["bun:*"] }],
		},
		{
			code: 'const mod = await import("fs");',
		},
		{
			code: 'const mod = require("fs");',
		},
		{
			code: 'await import("bun");',
			options: [{ allowedModules: ["bun"] }],
		},
		{
			code: 'require("bun:sqlite");',
			options: [{ allowedModules: ["bun:sqlite"] }],
		},
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
		{
			code: 'import { sql } from "bun";',
			options: [{ allowedModules: ["bun:test"] }],
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'import { Database } from "bun:sqlite";',
			options: [{ allowedModules: ["bun:test", "bun"] }],
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'import { expect, test } from "bun:test";',
			options: [{ allowedModules: ["bun"] }],
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'await import("bun");',
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'await import("bun:ffi");',
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'const bun = require("bun");',
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'const sqlite = require("bun:sqlite");',
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'await import("bun:test");',
			options: [{ allowedModules: ["bun"] }],
			errors: [{ messageId: "noBunImports" }],
		},
		{
			code: 'require("bun");',
			options: [{ allowedModules: ["bun:test"] }],
			errors: [{ messageId: "noBunImports" }],
		},
	],
});
