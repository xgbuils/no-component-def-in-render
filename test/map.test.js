const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description:
			"map arrow function callback without component declaration inside",
		code: `
		const ParentComponent = ({list}) => {
			return (
				<div>
					{list.map((item) => {
						return <NestedComponent {...item} />
					})}
				</div>
			)
		};
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"map anonymous function callback without component declaration inside",
		code: `
		const ParentComponent = ({list}) => {
			return (
				<div>
					{list.map(function(item) {
						return <NestedComponent {...item} />
					})}
				</div>
			)
		};
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"map named function callback without component declaration inside",
		code: `
		const ParentComponent = ({list}) => {
			return (
				<div>
					{list.map(function innerFunction(item) {
						return <NestedComponent {...item} />
					})}
				</div>
			)
		};
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
];

const invalid = [
	{
		description:
			"map arrow function callback with component declaration inside",
		code: `
		const ParentComponent = ({list}) => {
			return (
				<div>
					{list.map((item) => {
						const NestedComponent = () => <div/>;
						return <NestedComponent {...item} />
					})}
				</div>
			)
		};
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"map anonymous function callback with component declaration inside",
		code: `
		const ParentComponent = ({list}) => {
			return (
				<div>
					{list.map(function(item) {
						const NestedComponent = () => <div/>;
						return <NestedComponent {...item} />
					})}
				</div>
			)
		};
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"map named function callback with component declaration inside",
		code: `
			const ParentComponent = ({list}) => {
				return (
					<div>
						{list.map(function innerFunction(item) {
							const NestedComponent = () => <div/>;
							return <NestedComponent {...item} />
						})}
					</div>
				)
			};
		`,
		errors: [{ message: ERROR_MESSAGE }],
	},
];

module.exports = createRuleTester({
	valid,
	invalid,
});
