module.exports = {
	singleQuote: true,
	bracketSpacing: false,
	trailingComma: 'all',

	// prettier-plugin-sort-imports
	importOrder: ['<THIRD_PARTY_MODULES>', '^@/(.*)$', '^[./]'],
	importOrderSeparation: true,
};
