import { ESLintUtils, type TSESTree } from "@typescript-eslint/utils";

const createRule = ESLintUtils.RuleCreator((name) => name);

type Options = [
	{
		allowedGlobals?: string[];
	},
];

export const rule = createRule<Options, "noBunGlobals">({
	create(context, [options]) {
		const allowedGlobals = options?.allowedGlobals ?? [];

		// check if a global API should be reported based on the allowedGlobals option
		const shouldReportGlobal = (globalName: string, propertyPath?: string) => {
			const fullPath = propertyPath
				? `${globalName}.${propertyPath}`
				: globalName;

			return !allowedGlobals.some((allowed) => {
				if (allowed === fullPath) {
					return true;
				}
				if (allowed.endsWith("*")) {
					const prefix = allowed.slice(0, -1);
					return fullPath.startsWith(prefix);
				}
				if (propertyPath && allowed === globalName) {
					return false;
				}
				return false;
			});
		};

		// check if an identifier is a global variable (not locally defined)
		const isGlobal = (name: string, node: TSESTree.Node) => {
			const scope = context.sourceCode.getScope(node);
			const variable = scope.set.get(name);
			if (variable && variable.defs.length > 0) {
				return false;
			}
			let currentScope: typeof scope | null = scope;
			while (currentScope) {
				const scopeVariable = currentScope.set.get(name);
				if (scopeVariable && scopeVariable.defs.length > 0) {
					return false;
				}
				currentScope = currentScope.upper;
			}
			return true;
		};

		// extract the property path from a MemberExpression (e.g., "Bun.env.NODE_ENV" -> "env.NODE_ENV")
		const getBunPropertyPath = (node: TSESTree.MemberExpression): string => {
			const parts: string[] = [];
			let current: TSESTree.Node = node;

			while (current.type === "MemberExpression") {
				if (current.property.type === "Identifier") {
					parts.unshift(current.property.name);
				}
				current = current.object;
			}

			return parts.join(".");
		};

		// check if a node is used in a TypeScript type context (not runtime code)
		const isInTypeContext = (node: TSESTree.Node): boolean => {
			let parent = node.parent;
			while (parent) {
				switch (parent.type) {
					// Type references and declarations
					case "TSTypeReference":
					case "TSTypeAnnotation":
					case "TSTypeAliasDeclaration":
					case "TSInterfaceDeclaration":
					case "TSTypeLiteral":

					// Type expressions
					case "TSAsExpression":
					case "TSSatisfiesExpression":
					case "TSTypeAssertion":
					case "TSNonNullExpression":
					case "TSInstantiationExpression":

					// Type parameters and arguments
					case "TSTypeParameter":
					case "TSTypeParameterDeclaration":
					case "TSTypeParameterInstantiation":

					// Function and constructor types
					case "TSFunctionType":
					case "TSConstructorType":
					case "TSCallSignatureDeclaration":
					case "TSConstructSignatureDeclaration":

					// Object type members
					case "TSPropertySignature":
					case "TSMethodSignature":
					case "TSIndexSignature":

					// Complex types
					case "TSConditionalType":
					case "TSInferType":
					case "TSMappedType":
					case "TSTemplateLiteralType":
					case "TSLiteralType":
					case "TSImportType":
					case "TSTypeQuery":
					case "TSTypePredicate":
					case "TSTypeOperator":

					// Composite types
					case "TSUnionType":
					case "TSIntersectionType":
					case "TSArrayType":
					case "TSTupleType":
					case "TSNamedTupleMember":
					case "TSOptionalType":
					case "TSRestType":
					case "TSIndexedAccessType":

					// Special types
					case "TSQualifiedName":
					case "TSThisType":
						return true;
				}
				parent = parent.parent;
			}
			return false;
		};

		return {
			MemberExpression(node) {
				// skip if used in type context
				if (isInTypeContext(node)) {
					return;
				}

				if (
					// check if the object is the Bun object
					node.object.type === "Identifier" &&
					node.object.name === "Bun" &&
					// check if the Bun object is a global variable
					isGlobal("Bun", node.object)
				) {
					// e.g. Bun.serve()
					const propertyPath = getBunPropertyPath(node);
					if (shouldReportGlobal("Bun", propertyPath)) {
						context.report({
							node,
							messageId: "noBunGlobals",
							data: {
								name: propertyPath ? `Bun.${propertyPath}` : "Bun",
							},
						});
					}
				} else if (
					// check if the object is globalThis
					node.object.type === "MemberExpression" &&
					node.object.object.type === "Identifier" &&
					node.object.object.name === "globalThis" &&
					// check if the property is the Bun object
					node.object.property.type === "Identifier" &&
					node.object.property.name === "Bun"
				) {
					// e.g. globalThis.Bun.serve()
					const propertyPath =
						node.property.type === "Identifier" ? node.property.name : "";
					if (shouldReportGlobal("Bun", propertyPath)) {
						context.report({
							node,
							messageId: "noBunGlobals",
							data: {
								name: propertyPath ? `Bun.${propertyPath}` : "Bun",
							},
						});
					}
				}
			},
			Identifier(node) {
				// skip if used in type context
				if (isInTypeContext(node)) {
					return;
				}

				if (
					// check if the identifier is the Bun object
					node.name === "Bun" &&
					// check if the Bun object is a global variable
					isGlobal("Bun", node)
				) {
					const parent = node.parent;
					if (parent?.type !== "MemberExpression" || parent.object !== node) {
						// e.g. Bun
						if (shouldReportGlobal("Bun")) {
							context.report({
								node,
								messageId: "noBunGlobals",
								data: {
									name: "Bun",
								},
							});
						}
					}
				} else if (node.name === "$" && isGlobal("$", node)) {
					const parent = node.parent;
					if (
						parent.type === "TaggedTemplateExpression" &&
						parent.tag === node
					) {
						// e.g. $`exit 1`
						if (shouldReportGlobal("$")) {
							context.report({
								node,
								messageId: "noBunGlobals",
								data: {
									name: "$",
								},
							});
						}
					}
				}
			},
		};
	},
	name: "no-bun-globals",
	meta: {
		type: "suggestion",
		docs: {
			description: "Avoid Bun global APIs",
		},
		schema: [
			{
				type: "object",
				properties: {
					allowedGlobals: {
						type: "array",
						items: {
							type: "string",
						},
						description:
							"Array of allowed Bun global APIs (e.g., ['Bun.env', 'Bun.version']). Supports wildcards (e.g., 'Bun.*')",
					},
				},
				additionalProperties: false,
			},
		],
		messages: {
			noBunGlobals: "{{name}} is a Bun-specific global API.",
		},
	},
	defaultOptions: [{}],
});
