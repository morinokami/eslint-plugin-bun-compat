import { ESLintUtils } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => name);

export const rule = createRule({
	create(context) {
		return {
			ImportDeclaration(node) {
				if (
					node.source.value === "bun" ||
					(typeof node.source.value === "string" &&
						node.source.value.startsWith("bun:"))
				) {
					context.report({
						node,
						messageId: "noBunImports",
						data: {
							source: node.source.value,
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
			description: "Disallow bun:* imports",
		},
		schema: [],
		messages: {
			noBunImports: "Import from {{source}} is not allowed",
		},
	},
	defaultOptions: [],
});
