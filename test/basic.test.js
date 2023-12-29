const { createRuleTester } = require("./ruleTester.js");

const ERROR_MESSAGE =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function "ParentComponent" where it is rendered.';
const ERROR_MESSAGE_WITHOUT_FUNCTION_NAME =
	'Do not define components during render. React will see a new component type on every render and destroy the entire subtree’s DOM nodes and state (https://react.dev/learn/your-first-component#nesting-and-organizing-components). Instead, move the component "NestedComponent" declaration out of the function where it is rendered.';

const nestedComponentReturnStatement = ({ withJSX }) =>
	withJSX ? "return <div />;" : 'return React.createElement("div", null);';

const nestedComponentDeclaration = {
	asFunction: ({ returnStatement }) => `
		function NestedComponent() {
			${returnStatement}
		}
	`,
	asConst: ({ returnStatement }) => `
		const NestedComponent = () => {
			${returnStatement}
		}
	`,
	asClass: ({ returnStatement }) => `
		class NestedComponent extends React.Component {
			render() {
				${returnStatement}
			}
		};
	`,
};

const nestedElement = ({ withJSX }) =>
	withJSX
		? "<NestedComponent />"
		: "React.createElement(NestedComponent, null)";

const parentComponentReturnStatement = ({ withJSX, nestedElement }) =>
	withJSX
		? `
		return (
			<div>
				${nestedElement}
			</div>
		);
	`
		: `
		return React.createElement(
			"div",
			null,
		  ${nestedElement}
		);
	`;

const parentDeclaration = {
	asFunction: ({ nestedDeclaration, returnStatement }) => `
		function ParentComponent() {
			${nestedDeclaration}

			${returnStatement}
		}
	`,
	asConst: ({ nestedDeclaration, returnStatement }) => `
		const ParentComponent = () => {
			${nestedDeclaration}

			${returnStatement}
		}
	`,
	asClass: ({ nestedDeclaration, returnStatement }) => `
		class ParentComponent {
			render() {
				${nestedDeclaration}

				${returnStatement}
			}
		}
	`,
	asDefaultExport: ({ nestedDeclaration, returnStatement }) => `
		export default () => {
			${nestedDeclaration}

			${returnStatement}
		}
	`,
};

const createSimpleNestedCode = ({ withJSX, parentType, nestedType }) => {
	return parentDeclaration[parentType]({
		nestedDeclaration: nestedComponentDeclaration[nestedType]({
			returnStatement: nestedComponentReturnStatement({ withJSX }),
		}),
		returnStatement: parentComponentReturnStatement({
			withJSX,
			nestedElement: nestedElement({ withJSX }),
		}),
	});
};

const valid = [];

const invalid = [
	{
		code: `
		function ParentComponent() {
			const NestedComponent = () => <div/>;
			return <NestedComponent />;
		}
	`,
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asFunction",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asFunction",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asFunction",
			nestedType: "asConst",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asFunction",
			nestedType: "asConst",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asConst",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asConst",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asDefaultExport",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE_WITHOUT_FUNCTION_NAME }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asDefaultExport",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE_WITHOUT_FUNCTION_NAME }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asConst",
			nestedType: "asConst",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asConst",
			nestedType: "asConst",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asFunction",
			nestedType: "asClass",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asFunction",
			nestedType: "asClass",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asClass",
			nestedType: "asClass",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asClass",
			nestedType: "asClass",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asClass",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asClass",
			nestedType: "asFunction",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	,
	{
		code: createSimpleNestedCode({
			withJSX: true,
			parentType: "asClass",
			nestedType: "asConst",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
	{
		code: createSimpleNestedCode({
			withJSX: false,
			parentType: "asClass",
			nestedType: "asConst",
		}),
		errors: [{ message: ERROR_MESSAGE }],
	},
];

module.exports = createRuleTester({
	valid,
	invalid,
});
