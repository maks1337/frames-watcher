/// <reference path="Context.ts" />
/// <reference path="Element.ts" />

namespace FrameWatcher {

    export class Runner {
        
        private context: Object;
        private _elements: Array<Object> = [];

        constructor(){
            this.context = new Context();
            this.bindScrollEvents();
        }

        bindScrollEvents():void {

            window.addEventListener('resize', ()=>{ this.checkElements(); });
            window.addEventListener('scroll', ()=>{ this.checkElements(); });

        }

        checkElements():void {
            
            for(let element of this._elements){
                
            }

        }

        registerElement(hookid:string,code:string):void {

            this._elements.push(new Element(hookid,code));
        
        }

        get elements():Array<Object> {
            return this._elements;
        }

    }
}