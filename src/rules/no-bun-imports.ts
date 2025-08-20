import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => name);

type Options = [
	{
		allowedModules?: string[];
	},
];

export const rule = createRule<Options, "noBunImports">({
	create(context, [options]) {
		const allowedModules = options?.allowedModules ?? [];
		// TODO: Add support for dynamic imports and commonjs requires
		return {
			ImportDeclaration(node) {
				const importSource = node.source.value;
				if (
					typeof importSource === "string" &&
					(importSource === "bun" || importSource.startsWith("bun:"))
				) {
					const isAllowed = allowedModules.some((allowed) => {
						if (allowed === importSource) {
							return true;
						}
						if (allowed.endsWith("*")) {
							const prefix = allowed.slice(0, -1);
							return importSource.startsWith(prefix);
						}
						return false;
					});

					if (!isAllowed) {
						context.report({
							node,
							messageId: "noBunImports",
							data: {
								source: importSource,
							},
						});
					}
				}
			},
		};
	},
	name: "no-bun-imports",
	meta: {
		type: "suggestion",
		docs: {
			description: "Avoid bun:* imports",
		},
		schema: [
			{
				type: "object",
				properties: {
					allowedModules: {
						type: "array",
						items: {
							type: "string",
						},
						description:
							"Array of allowed Bun module names (e.g., ['bun:test', 'bun:sqlite']). Supports wildcards (e.g., 'bun:*')",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			noBunImports:
				"Import from {{source}} is Bun-specific and won't work in Node.js",
		},
	},
	defaultOptions: [{}],
});
