/// <reference path="Context.ts" />
/// <reference path="Element.ts" />
/// <reference path="Estimation.ts" />
/// <reference path="Strategies.ts" />
/// <reference path="Sender.ts" />

namespace FrameWatcher {

    export class Runner {

        readonly tickRate: number = 1000;
        readonly timeLimit: number = (1000 * 60) * 10;

        private context: Context;
        private _elements: Array<Element> = [];
        private _debug: boolean = false;
        private _interval: any;
        private _timeElapsed: number = this.tickRate;
        private _strategies: Array<StrategyCheck> = [];
        private _sender: any;

        constructor(
            sender: string = "http",
            senderUrl: string,
            cookie: string = undefined,
            viewId: string = undefined) {

            this.context = new Context();
            this.loadStrategies();

            try {
                const select = new SenderSelect(sender, senderUrl);
                this._sender = select.returnObject();
                this._sender.cookie = cookie;
                this._sender.viewId = (viewId) ? viewId : new UUID().get();
                this.bindRuntime();
            } catch (error) {
                console.log(`Runner not started because: ${error}`);
            }
        }

        set debug(debug: boolean){
            this._debug = debug;
        }

        get debug(): boolean {
            return this._debug;
        }

        get sender(): Object {
            return this._sender;
        }

        get elements(): Array<Object> {
            return this._elements;
        }

        sendData(): void {
            this._sender.loadElements(this._elements);
            this._sender.send();
        }

        private loadStrategies() {
            const basic = new StrategyCheck(new BasicStrategy());
            const full = new StrategyCheck(new FullStrategy());
            const long = new StrategyCheck(new LongStrategy());
            const time = new StrategyCheck(new TimeStrategy());

            this._strategies[basic.name] = basic;
            this._strategies[full.name] = full;
            this._strategies[long.name] = long;
            this._strategies[time.name] = time;
        }

        protected run(): void {
            try {
                this.checkElements();
                this._timeElapsed += this.tickRate;
                this.expireRuntime();
                this.sendData();
            } catch (error) {
                console.log(`runtime stopped ${error}`);
                this.expireRuntime(true);
            }

        }

        bindRuntime(): void {
            /** first "dry" run */
            this.run();
            window.addEventListener("resize", () => { this.context.setSize(0, 0); });
            this._interval = setInterval(() => this.run(), this.tickRate);
        }

        expireRuntime(force: boolean = false): boolean {
            if (this._timeElapsed >= this.timeLimit || force) {
                clearInterval(this._interval);
                return true;
            }
            return false;
        }

        checkElements(): void {
            if (this._debug === true) {
                console.log(`------ second: ${this._timeElapsed / 1000}`);
            }

            for (let element of this._elements){

                const estimation = new Estimation(element, this.context);
                const percent = estimation.calculate();

                element.addToTimeline(percent);
                element.viewed = [];

                for (let name in this._strategies) {

                    const strategy = this._strategies[name];

                    element.viewed.push([
                        strategy.name,
                        strategy.run(element.getTimeline())
                    ]);

                }

                if (this._debug === true) {
                    console.log(element.id, element.code, percent, element.viewed);
                }
            }
        }

        registerElement(hookid: string, code: string): void {
            this._elements.push(new Element(hookid, code));
            this.checkElements();
        }

    }
}