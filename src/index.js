const { createErrorCollector } = require("./utils/errorCollector.js");
const { createParentTraverser } = require("./utils/parentTraverser.js");

const generateErrorMessage = (functionName, componentName) => {
	return `Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "${componentName}" declaration out of the function${
		functionName ? ` "${functionName}" ` : " "
	}where it is rendered.`;
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
	const reporter = createReporter(context, componentName);
	const parentTraverser = createParentTraverser(node);
	const errorCollector = createErrorCollector(context, componentName);

	parentTraverser
		.forEach((node) => {
			if (node.type === "BlockStatement") {
				errorCollector.evaluateVariables(node);
			}
		})
		.end((callable) => {
			errorCollector.evaluateParams(callable);
			const nodes = errorCollector.getErrorNodes();
			reporter.report(callable.getName(), nodes);
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
					allowRenaming: {
						type: "boolean",
					},
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
