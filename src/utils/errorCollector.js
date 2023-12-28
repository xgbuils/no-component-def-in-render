const { createBlockStatement } = require("../nodes/BlockStatement");

const createNestedComponentValidator = (componentName, options) => {
	let currentVariableNames = [componentName];
	const invalidVariableValues = [];
	return {
		evaluate(blockStatement) {
			freeVariables = new Set();
			let currentVariableValues;
			let nextVariableValues = currentVariableNames.reduce(
				(result, variableName) => {
					const variable = blockStatement.getVariable(variableName);
					if (variable) {
						result.push(variable.init);
					}
					return result;
				},
				[],
			);
			while (nextVariableValues.length > 0) {
				currentVariableValues = nextVariableValues;
				nextVariableValues = [];
				for (const variableValue of currentVariableValues) {
					if (
						options.allowOrOperator &&
						variableValue.type === "LogicalExpression" &&
						variableValue.operator == "||"
					) {
						nextVariableValues.push(variableValue.left);
						nextVariableValues.push(variableValue.right);
					} else if (
						options.allowNullishOperator &&
						variableValue.type === "LogicalExpression" &&
						variableValue.operator == "??"
					) {
						nextVariableValues.push(variableValue.left);
						nextVariableValues.push(variableValue.right);
					} else if (
						options.allowComponentMap &&
						variableValue.type === "MemberExpression"
					) {
						nextVariableValues.push(variableValue.object);
					} else if (
						options.allowTernary &&
						variableValue.type === "ConditionalExpression"
					) {
						nextVariableValues.push(variableValue.consequent);
						nextVariableValues.push(variableValue.alternate);
					} else if (variableValue.type === "Identifier") {
						const nextVariable = blockStatement.getVariable(variableValue.name);
						if (nextVariable) {
							nextVariableValues.push(nextVariable.init);
						} else {
							freeVariables.add(variableValue.name);
						}
					} else {
						invalidVariableValues.push(variableValue);
					}
				}
			}
			currentVariableNames = [...freeVariables];
			return invalidVariableValues;
		},
	};
};

const calculateOptions = (context) => {
	const options = context.options[0] ?? {};
	if (Object.keys(options).length === 0) {
		return {};
	}
	return {
		...options,
		allowRenaming: true,
	};
};

const createErrorCollector = (context, componentName) => {
	const options = calculateOptions(context);
	const nestedComponentValidator = createNestedComponentValidator(
		componentName,
		options,
	);
	let errorNode = null;
	let invalidNodes = [];

	return {
		evaluateVariables(node) {
			const blockStatement = createBlockStatement(node);
			if (!errorNode) {
				if (options.allowRenaming) {
					invalidNodes = nestedComponentValidator.evaluate(blockStatement);
				} else {
					errorNode = blockStatement.getVariable(componentName);
					if (errorNode) {
						invalidNodes.push(errorNode);
					}
				}
			}
		},
		evaluateParams(callable) {
			if (!errorNode) {
				errorNode = callable.getParam(componentName);
				if (errorNode) {
					invalidNodes.push(errorNode);
				}
			}
		},
		getErrorNodes() {
			return invalidNodes;
		},
	};
};

module.exports = {
	createErrorCollector,
};
