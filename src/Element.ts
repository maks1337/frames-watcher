/// <reference path="Namespace.ts" />

namespace FrameWatcher {

    export class Element {

        id: string;
        code: string;
        element: HTMLElement;
        rects: Object;
        viewed: Object = {};
        private _timeline: Array<number> = [];

        constructor(hookid: string, code: string){

            const hook = document.getElementById(hookid);
    
            if(!(hook instanceof Object)){
                throw new Error('Invalid hook id');
            }

            this.element = this.getHookParent(hook);
            this.id = this.element.id;
            this.code = code;

        }

        getHookParent(hook: HTMLElement):HTMLElement{

            return hook.parentElement;

        }

        getTimeline():Array<number>{
            return this._timeline;
        }
        
        addToTimeline(visibility:number){
            if(visibility > 0){
                this._timeline.push(visibility);
            }
        }
        
        getSize():Object {

            return { width: this.element.offsetWidth,height: this.element.offsetHeight }

        }

        getRects():Object{

            if(!(this.element instanceof Object)){
                throw new Error('FrameElement element in not a proper object');
            }

            if('getClientRects' in this.element){
                this.rects = this.element.getClientRects()[0];
                return this.rects;
            }else{
                throw new Error('FrameElement can\'t get element rects');
            }

        }

    }

}