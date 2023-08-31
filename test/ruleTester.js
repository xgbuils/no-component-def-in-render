const { RuleTester } = require("eslint");
const noNestedComponentDefinition = require("../src");

const removeDescription = ({ description, ...props }) => props;

const createRuleTester = () => {
	const ruleTester = new RuleTester({
		// Must use at least ecmaVersion 2015 because
		// that's when `const` variables were introduced.
		parserOptions: {
			ecmaVersion: 2015,
			ecmaFeatures: { jsx: true },
			sourceType: "module",
		},
	});

	return {
		run({ valid, invalid }) {
			ruleTester.run(
				"restricted-nested-component-def", // rule name
				noNestedComponentDefinition, // rule code
				{
					valid: valid.map(removeDescription),
					invalid: invalid.map(removeDescription),
				},
			);
		},
	};
};

module.exports = {
	createRuleTester,
};
