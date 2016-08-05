class FrameElement {

    id: string;
    code: string;
    rects: Object;
    element: HTMLElement;
    private _viewed: boolean = false;

    constructor(id: string, code: string,element: HTMLElement){
        this.element = element;
        this.getRects();
        this.id = id;
        this.code = code;
    }

    get viewed():boolean {
        return this._viewed;
    }
    
    set viewed(viewed:boolean){
        this._viewed = viewed;
    }

    getRects(){
        if('getClientRects' in this.element){
            this.rects = this.element.getClientRects()[0];
        }else{
           throw new ReferenceError('FrameElement can\'t get element rects');
        }
    }

}