class FrameElement {

    id: string;
    code: string;
    rects: Object;
    element: HTMLElement;
    private _viewed: boolean = false;

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

    get viewed():boolean {
        return this._viewed;
    }
    
    set viewed(viewed:boolean){
        this._viewed = viewed;
    }

    getRects():void{

        if(!(this.element instanceof Object)){
            throw new Error('FrameElement element in not a proper object');
        }

        if('getClientRects' in this.element){
            this.rects = this.element.getClientRects()[0];
        }else{
           throw new Error('FrameElement can\'t get element rects');
        }
    }

}