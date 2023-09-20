const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description: "nested component assign",
		code: `
      const ParentComponent = () => {
        const NestedComponent = AnotherComponent;
        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
	},
	{
		description: "multiple nested component assign",
		code: `
      const ParentComponent = () => {
        const SecondComponent = FirstComponent;
        const ThirdComponent = SecondComponent;
        const NestedComponent = ThirdComponent;

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
	},
	{
		description: "simple object destructuring renaming",
		code: `
      const ParentComponent = () => {
        const { AnotherComponent: NestedComponent } = { AnotherComponent };

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
	},
	{
		description: "simple object destructuring renaming",
		code: `
      const ParentComponent = () => {
        const { NestedComponent } = { NestedComponent: AnotherComponent };

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
	},
	{
		description: "simple array destructuring renaming",
		code: `
      const ParentComponent = () => {
        const [NestedComponent] = [AnotherComponent];

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
	},
	{
		description: "array, then object destructuring",
		code: `
      const ParentComponent = () => {
        const [{ NestedComponent }] = [{ NestedComponent: AnotherComponent }];

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
	},
	{
		description: "object, then array destructuring",
		code: `
      const ParentComponent = () => {
        const { foo: [, NestedComponent] } = { foo: [FirsComponent, SecondComponent] };

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
	},
];

const invalid = [
	{
		description: "nested component assign",
		code: `
      const ParentComponent = ({success}) => {
        const NestedComponent = OtherComponent;
        return <NestedComponent />;
      }
    `,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"multiple nested component assign that finishes with nested definition",
		code: `
      const ParentComponent = () => {
        const FirstComponent = () => <div />;
        const SecondComponent = FirstComponent;
        const ThirdComponent = SecondComponent;
        const NestedComponent = ThirdComponent;

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "simple object destructuring definition",
		code: `
      const ParentComponent = () => {
        const { NestedComponent } = { NestedComponent: () => <div/> };

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description: "simple array destructuring definition",
		code: `
      const ParentComponent = () => {
        const [NestedComponent] = [() => <div/>];

        return <NestedComponent />;
      }
    `,
		options: [{ allowRenaming: true }],
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
