const { RuleTester } = require("eslint");
const noNestedComponentDefinition = require("../../src");

const removeDescription = ({ description, ...props }) => props;

const formatError = (error) => {
	const ErrorClass = Object.getPrototypeOf(error).constructor;
	return new ErrorClass(error);
};

const createRuleTester = ({ valid = {}, invalid = {} } = {}) => {
	const ruleTester = new RuleTester({
		// Must use at least ecmaVersion 2015 because
		// that's when `const` variables were introduced.
		parserOptions: {
			ecmaVersion: 2015,
			ecmaFeatures: { jsx: true },
			sourceType: "module",
		},
	});

	const runRuleTest = (type) => (useCase) => {
		const cases = {
			valid: [],
			invalid: [],
			[type]: [removeDescription(useCase)],
		};
		try {
			ruleTester.run(
				"restricted-nested-component-def", // rule name
				noNestedComponentDefinition, // rule code
				cases,
			);
		} catch (error) {
			throw formatError(error, useCase);
		}
	};

	return {
		run() {
			valid.forEach(runRuleTest("valid"));
			invalid.forEach(runRuleTest("invalid"));
		},
	};
};

module.exports = {
	createRuleTester,
};
