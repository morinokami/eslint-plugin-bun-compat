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

		const shouldReport = (module: string) => {
			if (module === "bun" || module.startsWith("bun:")) {
				const isAllowed = allowedModules.some((allowed) => {
					if (allowed === module) {
						return true;
					}
					if (allowed.endsWith("*")) {
						const prefix = allowed.slice(0, -1);
						return module.startsWith(prefix);
					}
					return false;
				});
				return !isAllowed;
			}
			return false;
		};

		return {
			ImportDeclaration(node) {
				if (shouldReport(node.source.value)) {
					// e.g. import { sql } from "bun";
					context.report({
						node,
						messageId: "noBunImports",
						data: {
							source: node.source.value,
						},
					});
				}
			},
			ImportExpression(node) {
				if (
					// check if the source is a string literal
					node.source.type === "Literal" &&
					typeof node.source.value === "string" &&
					shouldReport(node.source.value)
				) {
					// e.g. import("bun")
					context.report({
						node,
						messageId: "noBunImports",
						data: {
							source: node.source.value,
						},
					});
				}
			},
			CallExpression(node) {
				if (
					// check if the callee is a require function
					node.callee.type === "Identifier" &&
					node.callee.name === "require" &&
					// check if the first argument is a string literal
					node.arguments.length > 0 &&
					node.arguments[0].type === "Literal" &&
					typeof node.arguments[0].value === "string" &&
					shouldReport(node.arguments[0].value)
				) {
					// e.g. require("bun")
					context.report({
						node,
						messageId: "noBunImports",
						data: {
							source: node.arguments[0].value,
						},
					});
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
			noBunImports: "Import from {{source}} is Bun-specific.",
		},
	},
	defaultOptions: [{}],
});
