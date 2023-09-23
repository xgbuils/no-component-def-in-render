module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
	],
	parser: "@typescript-eslint/parser",
	parserOptions: { project: ["./tsconfig.json"] },
	plugins: [
		"@typescript-eslint"
	],
}