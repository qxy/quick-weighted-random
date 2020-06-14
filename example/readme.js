// import class
const WeightedRandom = require('../dist')

// mock function / data - this is just for demonstration
// it could be some external 'random number generator' library
const myRandom = (mySeed) => Math.abs(Math.sin(Math.random() * mySeed))
const mySeed = 123456

// constructor accepts an options object, where you can set the
// - (initial) weights, must be an array of numbers
// - custom random function, must return a number
//   between 0 (inclusive) and max (exclusive)
//
// declare type CustomRandomFunction = (max: number) => number;
// interface WeightedRandomOptions {
//     weights?: number[];
//     randFunc?: CustomRandomFunction;
// }
// constructor(options?: WeightedRandomOptions);
//
let wr = new WeightedRandom({
    weights: [20, 10.75, 0, 42, 50, 0.5],     // optional
    randFunc: (max) => myRandom(mySeed) * max // optional
})
console.log(wr.generate()) // 0, 1, 3, 4 or 5

// You can (re)set the weights or add new weight
//
// setWeights(weights: number[] | null): void;
// addWeight(weight: number): void;
//
wr.setWeights([100, 20]) // weights will be [100, 20]
wr.addWeight(50)         // weights will be [100, 20, 50]
wr.addWeight(40)         // weights will be [100, 20, 50, 40]
console.log(wr.generate()) // 0, 1, 2 or 3
//
wr.setWeights(null);                        // weights will be []  (empty)
[1, 2, 3].forEach(w => wr.addWeight(w * w)) // weights will be [1, 4, 9]
console.log(wr.generate()) // 0, 1 or 2

// Always check the generated random number before use
// as it can be less than zero, which is invalid index
//
// possible reasons are:
// - empty weight set
// - only zero weights
// - defective custom random function
//
// generate(): number;
wr.setWeights(null)
console.log(wr.generate()) // -1
wr.addWeight(0)
console.log(wr.generate()) // -1
//
wr = new WeightedRandom({
    weights: [20, 5, 10],
    randFunc: (max) => max + 1 // this is bad!
})
console.log(wr.generate()) // -1
