const { createRuleTester } = require("./ruleTester");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';

const valid = [
	{
		description:
			"create a component from an object with dynamic prop is valid when allowed",
		code: `
    const ParentComponent = ({type}) => {
      const NestedComponent = componentMap[type];
      return <NestedComponent />;
    }
  `,
		options: [{ allowComponentMap: true }],
	},
	{
		description:
			"create a component from an object with hardcoded prop is valid when allowed",
		code: `
    const ParentComponent = () => {
      const NestedComponent = componentMap.Component;
      return <NestedComponent />;
    }
  `,
		options: [{ allowComponentMap: true }],
	},
];

const invalid = [
	{
		description:
			"create a component from an object with dynamic prop is not valid if object is created inside the component",
		code: `
    const ParentComponent = ({type}) => {
      const componentMap = {
        medium: MediumComponent,
        large: LargeComponent,
      }
      const NestedComponent = componentMap[type];
      return <NestedComponent />;
    }
  `,
		options: [{ allowComponentMap: true }],
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		description:
			"create a component from an object with hardcoded prop is not valid if object is created inside the component",
		code: `
    const ParentComponent = ({type}) => {
      const componentMap = {
        medium: MediumComponent,
        large: LargeComponent,
      }
      const NestedComponent = componentMap.Component;
      return <NestedComponent />;
    }
  `,
		options: [{ allowComponentMap: true }],
		errors: [{ message: ERROR_MESSAGE }],
	},
];

module.exports = createRuleTester({
	valid,
	invalid,
});
