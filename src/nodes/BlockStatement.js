const functionDeclarationTypes = ["ClassDeclaration", "FunctionDeclaration"];

const createVariableCollector = (variables) => {
	return {
		add(id, init, declaratorNode) {
			if (id === null) {
				return;
			}
			if (id.type === "Identifier") {
				variables.set(id.name, {
					type: "VariableDeclarator",
					loc: id.loc,
					id,
					init,
					parent: declaratorNode.parent,
				});
			} else if (id.type === "ObjectPattern") {
				id.properties.forEach((property) => {
					const propValue = (init?.properties ?? []).find(
						(propValue) => propValue.key.name === property.key.name,
					) ?? { value: null };
					this.add(property.value, propValue.value, declaratorNode);
				});
			} else if (id.type === "ArrayPattern") {
				id.elements.forEach((element, index) => {
					this.add(element, init?.elements?.[index] ?? null, declaratorNode);
				});
			}
		},
	};
};

const createBlockStatement = (node) => {
	const variables = new Map();
	const variableCollector = createVariableCollector(variables);
	node.body.forEach((node) => {
		if (functionDeclarationTypes.includes(node.type)) {
			variables.set(node.id.name, node);
		} else if (node.type === "VariableDeclaration") {
			node.declarations.forEach((declarator) => {
				variableCollector.add(declarator.id, declarator.init, declarator);
			});
		}
	});
	return {
		getVariable: (name) => variables.get(name),
	};
};

module.exports = {
	createBlockStatement,
};
