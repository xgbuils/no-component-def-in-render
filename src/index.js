const { getIdentifiers } = require("./utils/getIdentifiers");
const { createParentTraverser } = require("./utils/parentTraverser");

const functionDeclarationTypes = ["ClassDeclaration", "FunctionDeclaration"];
const declarationTypes = [...functionDeclarationTypes, "VariableDeclaration"];

const getVariableIdentifiers = (node) => {
	return node.body
		.filter((node) => declarationTypes.includes(node.type))
		.flatMap(({ declarations, type, id }) => {
			return functionDeclarationTypes.includes(type)
				? id
				: declarations.flatMap(({ id }) => getIdentifiers(id));
		});
};

const generateErrorMessage = (functionName, componentName) => {
	return `Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "${componentName}" declaration out of the function${
		functionName ? ` "${functionName}" ` : " "
	}where it is rendered.`;
};

const createNestedComponentsFilter = (componentName) => (identifiers) => {
	return identifiers.filter((identifier) => identifier.name === componentName);
};

const createReporter = (context, componentName) => ({
	report: (functionName, nodes) => {
		if (nodes.length > 0) {
			nodes.forEach((node) => {
				context.report({
					node,
					message: generateErrorMessage(functionName, componentName),
					data: {},
				});
			});
		}
	},
});

const validate = (context, node, componentName) => {
	const filterNestedComponents = createNestedComponentsFilter(componentName);
	const reporter = createReporter(context, componentName);
	const parentTraverser = createParentTraverser(node);
	let nestedComponentNodes = [];

	parentTraverser
		.forEach((node) => {
			if (nestedComponentNodes.length === 0 && node.type === "BlockStatement") {
				const variables = getVariableIdentifiers(node);
				nestedComponentNodes = filterNestedComponents(variables);
			}
		})
		.end(({ parentName, paramIds }) => {
			if (nestedComponentNodes.length === 0) {
				nestedComponentNodes = filterNestedComponents(paramIds);
			}
			reporter.report(parentName, nestedComponentNodes);
		});
};

module.exports = {
	meta: {
		type: "problem",
		docs: {
			recommended: true,
			description: "Ensures nested component definitions cannot be implemented",
		},
		fixable: "code",
		hasSuggestions: true,
		schema: [
			{
				type: "object",
				properties: {
					allowTernary: {
						type: "boolean",
					},
				},
				additionalProperties: false,
			},
		],
	},
	create(context) {
		return {
			JSXElement(node) {
				validate(context, node, node.openingElement.name.name);
			},
			Identifier(node) {
				const parentNode = node?.parent;
				if (parentNode?.type !== "CallExpression") {
					return;
				}
				const calleeNode = parentNode.callee;
				if (calleeNode.object?.name !== "React") {
					return;
				}
				if (calleeNode.property.name !== "createElement") {
					return;
				}
				validate(context, node, node.name);
			},
		};
	},
};
