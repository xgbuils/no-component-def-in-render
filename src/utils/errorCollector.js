const { createBlockStatement } = require("../nodes/BlockStatement");

const getRenamedVariable = (blockStatement, variableName) => {
	let currentVariableName = variableName;
	let node = blockStatement.getVariable(variableName);
	while (node && node.init.type === "Identifier") {
		currentVariableName = node.init.name;
		node = blockStatement.getVariable(currentVariableName);
	}
	return currentVariableName;
};

const createErrorCollector = (context, componentName) => {
	const options = context.options[0] ?? {};
	let variableToCheck = componentName;
	let errorNode = null;

	return {
		evaluateVariables(node) {
			const blockStatement = createBlockStatement(node);
			if (!errorNode) {
				if (options.allowRenaming) {
					variableToCheck = getRenamedVariable(blockStatement, variableToCheck);
					errorNode = blockStatement.getVariable(variableToCheck);
				} else {
					errorNode = blockStatement.getVariable(variableToCheck);
				}
			}
		},
		evaluateParams(callable) {
			if (!errorNode) {
				errorNode = callable.getParam(componentName);
			}
		},
		getErrorNodes() {
			return errorNode ? [errorNode] : [];
		},
	};
};

module.exports = {
	createErrorCollector,
};
