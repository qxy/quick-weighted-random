"use strict";
class QuickWeightedRandom {
    constructor(options) {
        this.pSum = 0;
        this.pool = [];
        this.randFunc = (max) => Math.random() * max;
        if (options && typeof options === 'object' && options.constructor === Object) {
            if (Array.isArray(options.weights)) {
                this.setWeights(options.weights);
            }
            if (typeof options.randFunc === 'function') {
                this.randFunc = options.randFunc;
            }
        }
    }
    setWeights(weights) {
        this.pSum = 0;
        this.pool = [];
        if (weights && Array.isArray(weights)) {
            weights.forEach(w => this.addWeight(w));
        }
    }
    addWeight(weight) {
        if (weight < 0)
            weight = 0;
        this.pSum += weight;
        this.pool.push(this.pSum);
    }
    generate() {
        const pool = this.pool;
        const rnd = this.randFunc(this.pSum);
        if (!pool.length || rnd < 0 || rnd >= this.pSum) {
            return -1;
        }
        let lo = 0;
        let hi = pool.length - 1;
        let mid = -1;
        while (lo <= hi) {
            mid = lo + Math.floor((hi - lo) / 2);
            if (rnd < pool[mid] && (mid == 0 || rnd >= pool[mid - 1])) {
                return mid;
            }
            else {
                if (rnd < pool[mid]) {
                    hi = mid - 1;
                }
                else {
                    lo = mid + 1;
                }
            }
        }
        throw 'Failed to generate weighted random!';
    }
}
module.exports = QuickWeightedRandom;
//# sourceMappingURL=index.js.map