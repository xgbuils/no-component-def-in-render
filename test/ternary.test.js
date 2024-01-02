const ERROR_MESSAGE =
	"Do not define component NestedComponent in the same scope is rendered. Move the component definition out of the ParentComponent scope. More info: https://react.dev/learn/your-first-component#nesting-and-organizing-components";

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

export { valid, invalid };
