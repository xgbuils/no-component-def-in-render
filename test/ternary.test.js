const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [];

const invalid = [
	{
		description: "create a nested component using ternary is not valid",
		code: `
		const ParentComponent = ({success}) => {
			const NestedComponent = success ? SuccessComponent : ErrorComponent;
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
];

const run = () => {
	const ruleTester = createRuleTester();
	ruleTester.run({
		// checks
		// 'valid' checks cases that should pass
		valid,
		// 'invalid' checks cases that should not pass
		invalid,
	});
};

module.exports = {
	run,
};