const { getIdentifiers } = require("./getIdentifiers");

const getParamIdentifiers = (node) => node.params.flatMap(getIdentifiers);

const isParentPredicateMap = {
	MethodDefinition: (node) => node.type === "FunctionExpression",
	FunctionDeclaration: (node) => true,
	ArrowFunctionExpression: (node) => node.parent.type !== "CallExpression",
	FunctionExpression: (node) =>
		!["CallExpression", "MethodDefinition"].includes(node.parent.type),
};
const never = () => false;

const createMaybeParentComponent = (node) => {
	const rawNode = node;
	const isMethod = node?.type === "MethodDefinition";
	const functionNode = isMethod ? node.value : node;
	const isParentPredicate = isParentPredicateMap[node.type] || never;
	const isParent = isParentPredicate(functionNode);
	return {
		rawNode,
		isParent,
		getParamIds: () => getParamIdentifiers(functionNode),
		getParentName: () => {
			if (!isParent) {
				return "";
			}
			if (isMethod) {
				return node.key.name === "render"
					? node.parent.parent.id.name
					: node.key.name;
			}
			if (node.type === "FunctionDeclaration") {
				return node.id.name;
			}
			if (node?.parent?.type !== "VariableDeclarator") {
				return "";
			}
			return node.parent.id.name;
		},
	};
};

module.exports = {
	createMaybeParentComponent,
};
