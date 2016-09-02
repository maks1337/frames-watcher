namespace FrameWatcher {

    interface Strategy {
        name: string;
        validate(timeline: Array<number>): boolean;
    }

    export class BasicStrategy implements Strategy {
        name: string = "basic";
        public validate(timeline: Array<number>): boolean {
            return (timeline.sort()[timeline.length - 1] >= 0.5);
        }
    }

    export class FullStrategy implements Strategy {
        name: string = "full";
        public validate(timeline: Array<number>): boolean {
            return (timeline.sort()[timeline.length - 1] === 1);
        }
    }

    export class LongStrategy implements Strategy {
        name: string = "long";
        public validate(timeline: Array<number>): boolean {
            const counts = timeline.reduce(function (acc, curr) {
                acc[curr] ? acc[curr]++ : acc[curr] = 1;
                return acc;
            }, {});
            return counts["1"] ? counts["1"] >= 5 : counts["1"] < 5;
        }
    }

    export class TimeStrategy implements Strategy {
        name: string = "time";
        public validate(timeline: Array<number>): boolean {
            const counts = timeline.reduce(function (acc, curr) {
                acc[curr] ? acc[curr]++ : acc[curr] = 1;
                return acc;
            }, {});
            return counts["1"] ? counts["1"] >= 5 : counts["1"] < 5;
        }
    }

    export class StrategyCheck {
        name: string;
        private strategy: Strategy;
        constructor(strategy: Strategy) {
            this.strategy = strategy;
            this.name = strategy.name;
        }
        run(timeline: Array<number>): boolean {
            return this.strategy.validate(timeline);
        }
    }
}