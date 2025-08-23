import { RuleTester } from "@typescript-eslint/rule-tester";
import * as vitest from "vitest";

import { rule } from "./no-bun-globals";

RuleTester.afterAll = vitest.afterAll;
RuleTester.it = vitest.it;
RuleTester.itOnly = vitest.it.only;
RuleTester.describe = vitest.describe;

const ruleTester = new RuleTester();

ruleTester.run("no-bun-globals", rule, {
	valid: [
		"console.log(result);",
		"const response = await fetch(url);",
		"function test() { const Bun = {}; Bun.serve(); }",
		"const MyBun = { serve: () => {} }; MyBun.serve();",
		"let file: Bun.S3File;",
		{
			code: "Bun.env.NODE_ENV",
			options: [{ allowedGlobals: ["Bun.env"] }],
		},
		{
			code: "Bun.version",
			options: [{ allowedGlobals: ["Bun.version"] }],
		},
		{
			code: "Bun.serve()",
			options: [{ allowedGlobals: ["Bun.*"] }],
		},
		{
			code: "Bun.file('test.txt')",
			options: [{ allowedGlobals: ["Bun.*"] }],
		},
		{
			code: "const result = await $`exit 1`;",
			options: [{ allowedGlobals: ["$"] }],
		},
	],
	invalid: [
		{
			code: "Bun;",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "Bun.argv",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "const result = await $`exit 1`;",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: 'const file = Bun.file("./hello.json");',
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "const [{ address }] = await Bun.dns.lookup('example.com');",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: 'const cookie = new Bun.Cookie("name", "value");',
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "const { serve } = Bun;",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "const bunAlias = Bun;",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "globalThis.Bun",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "Bun?.serve?.()",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "Bun['file']('test.txt')",
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "Bun.env.NODE_ENV",
			options: [{ allowedGlobals: ["Bun.version"] }],
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "Bun.serve()",
			options: [{ allowedGlobals: ["Bun.env"] }],
			errors: [{ messageId: "noBunGlobals" }],
		},
		{
			code: "if (typeof Bun !== 'undefined') { }",
			errors: [{ messageId: "noBunGlobals" }],
		},
	],
});
