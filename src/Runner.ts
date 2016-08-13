/// <reference path="Context.ts" />
/// <reference path="Element.ts" />
/// <reference path="Estimation.ts" />

namespace FrameWatcher {

    export class Runner {
        
        private context: Context;
        private _elements: Array<Element> = [];
        private _debug: boolean;
        private _intervalTickRate: number = 1000;
        private _interval: any;
        private _timeLimit: number = (1000*60)*60;
        private _timeElapsed: number = this._intervalTickRate;

        constructor(){
            this.context = new Context();
            this.bindRuntime();
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
            
            if(this.debug){
                console.log(`------ second: ${this._timeElapsed/1000}`);
            }

            for(let element of this._elements){

                const estimation = new Estimation(element,this.context);
                const percent = estimation.runCalculation();

                if(percent > 0.5){
                    element.viewed = true;
                    element.timevisible += this._intervalTickRate;
                }

                if(this.debug){
                    console.log(element.id,element.code,percent,element.viewed,element.timevisible);
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