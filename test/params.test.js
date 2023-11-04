const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [];

const invalid = [
	{
		description: "component in params definition is not valid",
		code: `
			const ParentComponent = ({NestedComponent}) => {
				return <NestedComponent />;
			}
		`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "aliased component in params definition is not valid",
		code: `
			const ParentComponent = ({ParamComponent: NestedComponent}) => {
				return <NestedComponent />;
			}
		`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	/*{
    description: "component in complex param structure definition is not valid",
    code: `
      const ParentComponent = ({array: [NestedComponent]}) => {
        return <NestedComponent />;
      }
    `,
    errors: [{ message: ERROR_MESSAGE }],
  },*/
	{
		description: "renamed variable component in params definition is not valid",
		code: `
			const ParentComponent = ({ParamComponent}) => {
        const NestedComponent = ParamComponent
				return <NestedComponent />;
			}
		`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"renamed component inside condition in params definition is not valid",
		code: `
			const ParentComponent = ({ok, ParamComponent}) => {
        const RenamedComponent = ParamComponent;
        if (ok) {
          const NestedComponent = RenamedComponent
          return <NestedComponent />;
        }
        return null;
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
