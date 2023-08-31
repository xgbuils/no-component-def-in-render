const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description: "HOC with arrow functions",
		code: `
		const withHappiness = (Component) => (props) => (
			<Happy>
				<Component {...props} />
			</Happy>
		);
	`,
	},
	{
		description: "HOC with inner anonymous function expression",
		code: `
		const withHappiness = (Component) => function(props) {
			return (
				<Happy>
					<Component {...props} />
				</Happy>
			)
		};
	`,
	},
	{
		description: "HOC with inner named function expression",
		code: `
		const withHappiness = (Component) => function innerFunction(props) {
			return (
				<Happy>
					<Component {...props} />
				</Happy>
			)
		};
	`,
	},
	{
		code: `
		const NestedComponent = withHappiness(SadNestedComponent);
		const ParentComponent = () => {
			return <NestedComponent />;
		}
	`,
	},
];

const invalid = [
	{
		description: "Nested component using a HOC",
		code: `
		const ParentComponent = () => {
			const NestedComponent = withHappiness(SadNestedComponent);
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
];

const run = () => {
	const ruleTester = createRuleTester();
	ruleTester.run({
		valid,
		invalid,
	});
};

module.exports = {
	run,
};
