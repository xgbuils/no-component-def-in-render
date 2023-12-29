const { createRuleTester } = require("./ruleTester/index.js");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [];

const invalid = [
	{
		description: "Nested component using useMemo",
		code: `
		const ParentComponent = () => {
			const NestedComponent = useMemo(() => () => <Component />, []);
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "Nested component using useCallback",
		code: `
		const ParentComponent = () => {
			const NestedComponent = useMemo(() => <Component />, []);
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
];

module.exports = createRuleTester({
	valid,
	invalid,
});
