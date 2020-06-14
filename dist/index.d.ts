declare type CustomRandomFunction = (max: number) => number;
interface WeightedRandomOptions {
    weights?: number[];
    randFunc?: CustomRandomFunction;
}
declare class QuickWeightedRandom {
    private pSum;
    private pool;
    private randFunc;
    constructor(options?: WeightedRandomOptions);
    setWeights(weights: number[] | null): void;
    addWeight(weight: number): void;
    generate(): number;
}
export = QuickWeightedRandom;
//# sourceMappingURL=index.d.ts.map