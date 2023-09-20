const { getIdentifiers } = require("../utils/getIdentifiers");

const getParamIdentifiers = (node) => node.params.flatMap(getIdentifiers);

const createCallable = (node) => {
	const identifiers = getParamIdentifiers(node);
	const paramIdentifiers = new Map(identifiers.map((id) => [id.name, id]));

	return {
		getParam(paramName) {
			return paramIdentifiers.get(paramName);
		},
		getName() {
			if (node.id?.name) {
				return node.id.name;
			}
			const parent = node.parent;
			if (parent.type === "MethodDefinition") {
				return parent.key.name === "render"
					? parent.parent.parent.id.name
					: parent.key.name;
			}
			return parent.id?.name;
		},
	};
};

module.exports = {
	createCallable,
};
