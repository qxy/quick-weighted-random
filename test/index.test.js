/* eslint-env node */

const WeightedRandom = require('../dist')
const utilities = require('../test/utilities')
const { randomWeights, calcPercents } = utilities

// add range check
expect.extend({
	toBeWithinRange(received, floor, ceiling) {
		// floor -> inclusive && ceiling -> exclusive
		if (received >= floor && received < ceiling) {
			return { // PASS
				message: () =>
					`expected not to be within range: ${floor} <= ${received} < ${ceiling}`,
				pass: true,
			}
		} else {
			return { // FAIL
				message: () =>
					`expected to be within range: ${floor} <= ${received} < ${ceiling}`,
				pass: false,
			}
		}
	}
})

/*
 *  constructor()
 */
describe('constructor', () => {

	describe('weights', () => {
		const optionsNoWeights = [
			[undefined],
			[null],
			[{}],
			[[]],
			[[20, 30, 50]],
			['invalid options'],
			[{ invalid: 'options' }],
			[{ weights: [] }],
			[{ weights: 'not an array' }]
		]
		test.each(optionsNoWeights)('should return -1 with no weights', options => {
			const wr = new WeightedRandom(options)
			expect(wr.generate()).toBe(-1)
		})

		const zeroWeights = [
			[{ weights: [0] }],
			[{ weights: [0, 0, 0, 0] }]
		]
		test.each(zeroWeights)('should return -1 with ONLY zero weights', weights => {
			const wr = new WeightedRandom({ weights })
			expect(wr.generate()).toBe(-1)
		})

		const weights = [
			[randomWeights(1)],
			[randomWeights(10)],
			[randomWeights(100)],
			[randomWeights(1000)],
			[randomWeights(10000)]
		]
		test.each(weights)('should return number between 0 and weights.length', weights => {
			const wr = new WeightedRandom({ weights })
			expect(wr.generate()).toBeWithinRange(0, weights.length)
		})
	})

	describe('randFunc', () => {
		const randFuncs = [
			[max => max * -1], // random function must return >= 0
			[max => max],      // random function must return < max
			[max => max + 1]   // random function must return < max
		]
		test.each(randFuncs)('should return -1 with defective random function', randFunc => {
			const weights = randomWeights(5)
			const wr = new WeightedRandom({ weights, randFunc })
			expect(wr.generate()).toBe(-1)
		})
	})
})

/*
 *  setWeights()
 */
describe('setWeights', () => {

	const badWeights = [
		[undefined],
		['nope'],
		[null],
		[[]],
		[{ weights: [1, 2, 3] }]
	]
	test.each(badWeights)('should return -1 when empty/invalid weights set', badWeights => {
		const weights = randomWeights(5)
		const wr = new WeightedRandom({ weights })
		wr.setWeights(badWeights)
		expect(wr.generate()).toBe(-1)
	})

	const zeroWeights = [
		[[0]],
		[[0, 0, 0, 0]]
	]
	test.each(zeroWeights)('should return -1 with ONLY zero weights', zeroWeights => {
		const weights = randomWeights(5)
		const wr = new WeightedRandom({ weights })
		wr.setWeights(zeroWeights)
		expect(wr.generate()).toBe(-1)
	})

	const newWeights = [
		[randomWeights(1)],
		[randomWeights(10)],
		[randomWeights(100)],
		[randomWeights(1000)],
		[randomWeights(10000)]
	]
	test.each(newWeights)('should return number between 0 and weights.length', newWeights => {
		const wr = new WeightedRandom()
		wr.setWeights(newWeights)
		expect(wr.generate()).toBeWithinRange(0, newWeights.length)
	})
})

/*
 *  addWeight()
 */
describe('addWeight', () => {

	const zeroWeights = [
		[[0]],
		[[0, 0, 0, 0]]
	]
	test.each(zeroWeights)('should return -1 with ONLY zero weights', zeroWeights => {
		const wr = new WeightedRandom()
		zeroWeights.forEach(w => wr.addWeight(w))
		expect(wr.generate()).toBe(-1)
	})

	const newWeights = [
		[randomWeights(1)],
		[randomWeights(10)],
		[randomWeights(100)],
		[randomWeights(1000)],
		[randomWeights(10000)]
	]
	test.each(newWeights)('should return number between 0 and weights.length', newWeights => {
		const wr = new WeightedRandom()
		newWeights.forEach(w => wr.addWeight(w))
		expect(wr.generate()).toBeWithinRange(0, newWeights.length)
	})
})


/*
 *  generate()
 */
describe('generate', () => {

	// helper function to test percents accuracy
	function testAccuracy(weights) {
		// timer start
		const time = process.hrtime()[0]
		// calculate expected values
		const weightPercents = calcPercents(weights)
		// create results array with zero starting values
		const results = new Array(weights.length).fill(0)

		const wr = new WeightedRandom({ weights })
		const iterations = weights.length * 100

		let resultPercents
		let errors
		do {
			// generate / calculate result
			for (let i = iterations; i--;) {
				const index = wr.generate()
				results[index]++
			}
			resultPercents = calcPercents(results)

			errors = 0
			for (let i = 0; i < weights.length; i++) {
				const diff = Math.abs(weightPercents[i] - resultPercents[i])
				// only allow maximum 1% difference
				if (diff <= weightPercents[i] / 100) continue
				else errors++
			}
			// cannot run forever
			if (process.hrtime()[0] - time > 60) {
				throw ('Testing accuracy timed out!')
			}
			// keep going until reach desired accuracy
		} while (errors)

		return resultPercents
	}

	const weights = [
		[randomWeights(1)],
		[randomWeights(2)],
		[randomWeights(5)],
		[randomWeights(10)],
		[randomWeights(25)],
		[randomWeights(50)]
	]
	test.each(weights)('should return indices with a weighted chance', weights => {
		testAccuracy(weights)
	})

	const weightsWithZero = [
		[[0, ...randomWeights(1)]],
		[[...randomWeights(2), 0]],
		[[...randomWeights(5), 0, ...randomWeights(5)]],
		[[0, ...randomWeights(10), 0, 0, ...randomWeights(10), 50]]
	]
	test.each(weightsWithZero)('should handle zero weights', weightsWithZero => {
		testAccuracy(weightsWithZero)
	})

	test('should treat negative weights as zero', () => {
		let wr = new WeightedRandom({ weights: [-99] })
		expect(wr.generate()).toBe(-1)

		const resultPercents = testAccuracy([10, 8, -5, 20])
		expect(resultPercents[2]).toBe(0)
	})

	test('should leave input arrays intact', () => {
		const weights = [20, 20, 69, 420]
		const compare = weights.slice()

		let wr = new WeightedRandom({ weights })
		expect(weights).toStrictEqual(compare)

		wr.setWeights(weights)
		expect(weights).toStrictEqual(compare)
	})
})
