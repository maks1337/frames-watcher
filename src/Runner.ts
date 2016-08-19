/// <reference path="Context.ts" />
/// <reference path="Element.ts" />
/// <reference path="Estimation.ts" />
/// <reference path="Strategies.ts" />

namespace FrameWatcher {

    export class Runner {
        
        private context: Context;
        private _elements: Array<Element> = [];
        private _debug: boolean = false;
        private _intervalTickRate: number = 1000;
        private _interval: any;
        private _timeLimit: number = (1000*60)*10;
        private _timeElapsed: number = this._intervalTickRate;
        private _strategies: Array<StrategyCheck> = [];

        constructor(){

            this.context = new Context();
            this.bindRuntime();

            const basic = new StrategyCheck(new BasicStrategy()); 
            const full = new StrategyCheck(new FullStrategy()); 
            const long = new StrategyCheck(new LongStrategy()); 

            this._strategies[basic.name] = basic;
            this._strategies[full.name] = full;
            this._strategies[long.name] = long;

        }

        set debug(debug:boolean){
            this._debug = debug;
        }

        get debug():boolean {
            return this._debug;
        }

        bindRuntime():void {

            window.addEventListener('resize', ()=>{ this.context.setSize(0,0); });
            this._interval = setInterval(()=>{ 
                this.checkElements(); 
                this._timeElapsed += this._intervalTickRate; 
                this.expireRuntime();
            },this._intervalTickRate);

        }

        expireRuntime():boolean{

            if(this._timeElapsed >= this._timeLimit){
                clearInterval(this._interval);
                return true;
            }

            return false;

        }

        checkElements():void {

            if(this._debug === true){
                console.log(`------ second: ${this._timeElapsed/1000}`);
            }

            for(let element of this._elements){

                const estimation = new Estimation(element,this.context);
                const percent = estimation.runCalculation();

                element.addToTimeline(percent);

        
                for(let name in this._strategies){

                    const strategy = this._strategies[name];
                    element.viewed[strategy.name] = strategy.run(element.getTimeline());

                }

                if(this._debug === true){
                    console.log(element.id,element.code,percent,element.viewed);
                }

            }

        }

        registerElement(hookid:string,code:string):void {

            this._elements.push(new Element(hookid,code));
            this.checkElements();
        
        }

        get elements():Array<Object> {
            return this._elements;
        }

    }
}