/* eslint-env node */

// helper function to generate random weights
const randomWeights = function (length) {
	const weights = []
	for (let i = length; i--;) {
		weights.push(Math.ceil(Math.random() * 100))
	}
	return weights
}

// helper function to calculate percents of array values
const calcPercents = function (data) {
	if (!Array.isArray(data)) throw (
		'calcPercents() requires Array, got ' + data
	)
	// treat negative values as zero
	const safeData = data.map(d => d < 0 ? 0 : d)
	// interpolate
	const sum = safeData.reduce((a, c) => a + c, 0)
	return safeData.map(d => sum ? d / sum * 100 : 0)
}

module.exports = { randomWeights, calcPercents }
