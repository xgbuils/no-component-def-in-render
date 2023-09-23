const { createBlockStatement } = require("../nodes/BlockStatement");

const createRenamedVariablesChecker = (componentName) => {
	let currentVariableName = componentName;
	return {
		evaluate(blockStatement) {
			let node = blockStatement.getVariable(componentName);
			while (node) {
				if (node.init.type === "Identifier") {
					currentVariableName = node.init.name;
					node = blockStatement.getVariable(currentVariableName);
				} else {
					break;
				}
			}
			return currentVariableName;
		}
	}
}

const createErrorCollector = (context, componentName) => {
	const options = context.options[0] ?? {};
	const renamedVariablesChecker = createRenamedVariablesChecker(componentName);
	let errorNode = null;

	return {
		evaluateVariables(node) {
			const blockStatement = createBlockStatement(node);
			if (!errorNode) {
				if (options.allowRenaming) {
					const variableName = renamedVariablesChecker.evaluate(blockStatement);
					errorNode = blockStatement.getVariable(variableName);
				} else {
					errorNode = blockStatement.getVariable(componentName);
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
