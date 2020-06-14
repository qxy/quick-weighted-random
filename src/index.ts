
type CustomRandomFunction = (max: number) => number

interface WeightedRandomOptions {
	weights?: number[]
	randFunc?: CustomRandomFunction
}

class QuickWeightedRandom {

	private pSum: number
	private pool: number[]
	private randFunc: CustomRandomFunction

	constructor(options?: WeightedRandomOptions) {
		// default options
		this.pSum = 0
		this.pool = []
		this.randFunc = (max) => Math.random() * max

		if (options && typeof options === 'object' && options.constructor === Object) {
			// check for weights supplied
			if (Array.isArray(options.weights)) {
				this.setWeights(options.weights)
			}
			// check for random function callback supplied
			if (typeof options.randFunc === 'function') {
				this.randFunc = options.randFunc
			}
		}
	}

	public setWeights(weights: number[] | null): void {
		// empty pool
		this.pSum = 0
		this.pool = []
		// add each weight
		if (weights && Array.isArray(weights)) {
			weights.forEach(w => this.addWeight(w))
		}
	}

	public addWeight(weight: number): void {
		// treat negative weight as zero
		if (weight < 0) weight = 0
		// add up & store
		this.pSum += weight
		this.pool.push(this.pSum)
	}

	public generate(): number {
		const pool = this.pool
		const rnd = this.randFunc(this.pSum)
		// these values would not work
		if (!pool.length || rnd < 0 || rnd >= this.pSum) {
			return -1
		}
		// initial bounds
		let lo = 0
		let hi = pool.length - 1
		let mid = -1
		// binary search correct index
		// worst case `log2(poolsize) + 1` steps
		while (lo <= hi) {
			// divide
			mid = lo + Math.floor((hi - lo) / 2)
			// found?
			if (rnd < pool[mid] && (mid == 0 || rnd >= pool[mid - 1])) {
				return mid
			}
			// next division
			else {
				if (rnd < pool[mid]) {
					// left side
					hi = mid - 1
				}
				else {
					// right side
					lo = mid + 1
				}
			}
		}
		// something went wrong - you should never see this error
		throw 'Failed to generate weighted random!'
	}
}

export = QuickWeightedRandom
