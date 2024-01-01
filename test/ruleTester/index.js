import { RuleTester } from "eslint";
import { glob } from "glob";
import noNestedComponentDefinition from "../../src/index.js";
import * as path from "node:path";
import { formatError, formatErrorSummary, formatSuccess } from "./format.js";
import { createReport } from "./createReport.js";

const removeDescription = ({ description, ...props }) => props;

const createTestGroup = ({ valid, invalid, file } = {}) => {
	const errors = [];
	const ruleTester = new RuleTester({
		// Must use at least ecmaVersion 2015 because
		// that's when `const` variables were introduced.
		parserOptions: {
			ecmaVersion: 2015,
			ecmaFeatures: { jsx: true },
			sourceType: "module",
		},
	});

	const runRuleTest = (type) => (useCase, index) => {
		const cases = {
			valid: [],
			invalid: [],
			[type === "valid" ? "valid" : "invalid"]: [removeDescription(useCase)],
		};
		try {
			ruleTester.run(
				"restricted-nested-component-def", // rule name
				noNestedComponentDefinition, // rule code
				cases,
			);
		} catch (error) {
			errors.push(
				createReport(error, {
					...useCase,
					file,
					type,
					index,
				}),
			);
		}
	};

	return {
		run() {
			try {
				valid.forEach(runRuleTest("valid"));
				invalid.forEach(runRuleTest("invalid"));
				return errors;
			} catch (error) {
				console.error("eyy", error);
				return [];
			}
		},
	};
};

const createRuleTester = () => {
	return {
		async run() {
			let hasErrors = false;
			const files = await glob("test/**/*.test.js");
			await Promise.all(
				files.map(async (file) => {
					const filePath = path.resolve(process.cwd(), file);
					const {
						valid = [],
						invalid = [],
						parsing = [],
					} = await import(filePath);
					const numberOfTests = valid.length + invalid.length;
					const errors = createTestGroup({
						file,
						valid,
						invalid,
						parsing,
					}).run();
					if (errors.length > 0) {
						hasErrors = true;
						console.log(formatErrorSummary({ file, numberOfTests, errors }));
						errors.forEach((error) => {
							console.log(formatError(error));
						});
					} else {
						const summary = formatSuccess({ file, numberOfTests });
						console.log(summary);
					}
				}),
			);
			process.exit(hasErrors ? 1 : 0);
		},
	};
};

export { createRuleTester };
