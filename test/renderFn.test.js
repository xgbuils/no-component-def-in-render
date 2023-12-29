const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "parentFunction" where it is rendered.';
const ERROR_MESSAGE_WHEN_CLASS_COMPONENT =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description: "render arrow function",
		code: `
		const parentFunction = () => {
			return <NestedComponent />;
		}
	`,
	},
	{
		description: "render named function",
		code: `
		function parentFunction() {
			return <NestedComponent />;
		}
	`,
	},
	{
		description: "class method",
		code: `
	  class ParentComponent {
			parentFunction() {
				return <NestedComponent />;
			}
		}
	`,
	},
	{
		description: "class render method",
		code: `
	  class ParentComponent {
	 		render() {
				return <NestedComponent />;
			}
		}
	`,
	},
];

const invalid = [
	{
		description:
			"render arrow function that declares and renders the component",
		code: `
		const parentFunction = () => {
			const NestedComponent = () => <Component />;
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"render named function that declares and renders the component",
		code: `
		function parentFunction() {
			const NestedComponent = () => <Component />;
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "class method that declares and renders the component",
		code: `
	  class ParentComponent {
			parentFunction() {
				const NestedComponent = () => <Component />;
				return <NestedComponent />;
			}
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "class render method that declares and renders the component",
		code: `
	  class ParentComponent {
			render() {
				const NestedComponent = () => <Component />;
				return <NestedComponent />;
			}
		}
	`,
		errors: [{ message: ERROR_MESSAGE_WHEN_CLASS_COMPONENT }],
	},
];

module.exports = createRuleTester({
	valid,
	invalid,
});
