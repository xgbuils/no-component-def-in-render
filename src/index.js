import { createErrorCollector } from "./utils/errorCollector.js";
import { createParentTraverser } from "./utils/parentTraverser.js";

const generateErrorMessage = (functionName, componentName) => {
	return `Do not define component ${componentName} in the same scope is rendered. Move the component definition out of the${
		functionName ? ` ${functionName} ` : " function "
	}scope. More info: https://react.dev/learn/your-first-component#nesting-and-organizing-components`;
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

export default {
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
					allowComponentMap: {
						type: "boolean",
					},
					allowNullishOperator: {
						type: "boolean",
					},
					allowOrOperator: {
						type: "boolean",
					},
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
