import fs from "node:fs";

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
		// TODO: Add rules here
	},
};

const recommended = {
	plugins: {
		"bun-compat": plugin,
	},
	rules: {
		// TODO: Add rules here
	},
};

export default plugin;
