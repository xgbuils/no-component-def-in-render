const getIdentifiers = (node) => {
	if (node.type === "Identifier") {
		return [node];
	}
	if (node.type === "ObjectPattern") {
		return node.properties.flatMap(({ value }) => getIdentifiers(value));
	}
	return [];
};

module.exports = {
	getIdentifiers,
};
