const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description: "another unused component is declared in a object prop",
		code: `
  const ParentComponent = () => {
    const { AnotherComponent } = getComponents();
    return <NestedComponent />;
  }
`,
	},
	{
		description:
			"another unused component is declared and renamed from an object prop",
		code: `
  const ParentComponent = () => {
    const { prop: AnotherComponent } = getComponents();
    return <NestedComponent />;
  }
`,
	},
	{
		description: "another quite deep component is declared in object prop",
		code: `
  const ParentComponent = () => {
    const { 
      prop: {
        foo: { AnotherComponent }
      }
    } = getComponents();
    return <NestedComponent />;
  }
`,
	},
];

const invalid = [
	{
		description: "nested component is declared in a object prop",
		code: `
		const ParentComponent = () => {
			const { NestedComponent } = getComponents();
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "nested component is declared and renamed from an object prop",
		code: `
		const ParentComponent = () => {
			const { prop: NestedComponent } = getComponents();
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "quite deep nested component is declared in object prop",
		code: `
		const ParentComponent = () => {
			const { 
        prop: {
          foo: { NestedComponent }
        }
      } = getComponents();
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
