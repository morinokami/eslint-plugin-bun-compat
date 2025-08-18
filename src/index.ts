import fs from "node:fs";

import { rule as noBunImports } from "./rules/no-bun-imports";

const pkg = JSON.parse(
	fs.readFileSync(new URL("../package.json", import.meta.url), "utf8"),
);

const plugin = {
	configs: {
		get recommended() {
			return recommended;
		},
	},
	meta: {
		name: pkg.name,
		version: pkg.version,
	},
	rules: {
		"no-bun-imports": noBunImports,
	},
};

const recommended = {
	plugins: {
		"bun-compat": plugin,
	},
	rules: {
		"bun-compat/no-bun-imports": "error",
	},
};

export default plugin;
