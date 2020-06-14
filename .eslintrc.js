module.exports = {
	"root": true,
	"env": {
		"es6": true
	},
	"parserOptions": {
		"ecmaVersion": 6
	},
	"rules": {
		"semi": ["error", "never"],
		"indent": ["error", "tab"],
		"no-trailing-spaces": ["error"],
		"eol-last": ["error", "always"]
	},
	"overrides": [
		{
			"files": ["src/*.ts"],
			"parser": "@typescript-eslint/parser",
			"plugins": ["@typescript-eslint"],
			"extends": [
				"eslint:recommended",
				"plugin:@typescript-eslint/recommended"
			],
			"rules": {
				"semi": "off",
				"@typescript-eslint/semi": ["error", "never"],
				"indent": "off",
				"@typescript-eslint/indent": ["error", "tab"]
			}
		},
		{
			"files": ["test/*.js"],
			"plugins": ["jest"],
			"extends": [
				"eslint:recommended",
				"plugin:jest/recommended"
			]
		}
	]
}
