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

const parseNode = (node) => {
	const isMethod = node?.type === "MethodDefinition";
	const functionNode = isMethod ? node.value : node;
	const isParentPredicate = isParentPredicateMap[node.type] || never;
	const isParent = isParentPredicate(functionNode);
	return {
		node,
		functionNode,
		isParent,
		isMethod,
	};
};

const getParentName = ({ isParent, isMethod, node }) => {
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
};

const createParentTraverser = (node) => {
	return {
		forEach(callback) {
			let result = parseNode(node);
			let index = 0;
			while (!result.isParent) {
				callback(result.node);
				result = parseNode(result.node.parent);
			}
			return {
				end(callback) {
					const paramIds = getParamIdentifiers(result.functionNode);
					const parentName = getParentName(result);
					callback({ parentName, paramIds });
				},
			};
		},
	};
};

module.exports = {
	createParentTraverser,
};
