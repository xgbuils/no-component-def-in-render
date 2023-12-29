const { createRuleTester } = require("./ruleTester/index.js");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description: "create a nested component using ternary",
		code: `
      const ParentComponent = ({success}) => {
        const NestedComponent = success ? SuccessComponent : ErrorComponent;
        return <NestedComponent />;
      }
    `,
		options: [{ allowTernary: true }],
	},
	{
		description: "create a nested component using double ternary",
		code: `
      const ParentComponent = ({success, isValid}) => {
        const NestedComponent = success
					? (isValid ? SuccessValidComponent : SuccessInvalidComponent)
				  : (isValid ? ErrorValidComponent : ErrorInvalidComponent);
        return <NestedComponent />;
      }
    `,
		options: [{ allowTernary: true }],
	},
];

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

module.exports = createRuleTester({
	valid,
	invalid,
});
