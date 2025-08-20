import fs from "node:fs";
import type { TSESLint } from "@typescript-eslint/utils";

import { rule as noBunImports } from "./rules/no-bun-imports";

const pkg = JSON.parse(
	fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
) as typeof import("../package.json");

const base = {
	meta: {
		name: pkg.name,
		version: pkg.version,
	},
	rules: {
		"no-bun-imports": noBunImports,
	},
};

const recommended = {
	name: "bun-compat/recommended",
	plugins: {
		"bun-compat": base,
	},
	rules: {
		"bun-compat/no-bun-imports": "warn",
	},
} satisfies TSESLint.FlatConfig.Config;

const plugin = Object.assign(base, {
	configs: { recommended },
}) satisfies TSESLint.FlatConfig.Plugin;

export default plugin;
