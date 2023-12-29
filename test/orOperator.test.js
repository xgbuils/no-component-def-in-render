const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description:
			"using component map and OR operator to define a default component is valid when allowed",
		code: `
		const ParentComponent = ({type}) => {
			const NestedComponent = componentMap[type] || DefaultComponent;
			return <NestedComponent />;
		}
	`,
		options: [
			{
				allowComponentMap: true,
				allowOrOperator: true,
			},
		],
	},
	{
		description:
			"using component map, ternary operator and OR operator to define a default component is valid when allowed",
		code: `
		const ParentComponent = ({type, success}) => {
			const NestedComponent = (success
        ? componentMap[type] 
        : otherComponentMap[type]) 
        || DefaultComponent;
			return <NestedComponent />;
		}
	`,
		options: [
			{ allowComponentMap: true, allowTernary: true, allowOrOperator: true },
		],
		errors: [{ message: ERROR_MESSAGE }],
	},
];

const invalid = [
	{
		description:
			"using component map and OR operator with null default component is valid when allowed",
		code: `
		const ParentComponent = ({type}) => {
			const NestedComponent = componentMap[type] || null;
			return <NestedComponent />;
		}
	`,
		options: [{ allowComponentMap: true, allowOrOperator: true }],
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"using component map and OR operator to define a default component is valid when allowed",
		code: `
		const ParentComponent = ({type}) => {
			const NestedComponent = componentMap[type] || DefaultComponent;
			return <NestedComponent />;
		}
	`,
		options: [{ allowComponentMap: true }],
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"using component map, ternary operator and OR operator to define a default component is valid when allowed",
		code: `
		const ParentComponent = ({type, success}) => {
			const NestedComponent = (success
        ? componentMap[type] 
        : otherComponentMap[type]) 
        || DefaultComponent;
			return <NestedComponent />;
		}
	`,
		options: [{ allowComponentMap: true, allowTernary: true }],
		errors: [{ message: ERROR_MESSAGE }],
	},
];

module.exports = createRuleTester({
	valid,
	invalid,
});
