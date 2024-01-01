const ERROR_MESSAGE =
	"Do not declare component NestedComponent in the same scope is rendered. Move the component declaration out of the ParentComponent scope. More info: https://react.dev/learn/your-first-component#nesting-and-organizing-components";

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

export { valid, invalid };
