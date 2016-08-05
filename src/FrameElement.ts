class FrameElement {

    private id: string;
    private code: string;
    private element: HTMLElement;
    private rects: Object;
    private _viewed: boolean = false;
    private time: number = 0;

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
        if(this.element.hasOwnProperty('getClientRects')){
            this.rects = this.element.getClientRects();
        }else{
           throw new ReferenceError('FrameElement can\'t get element rects');
        }
    }

}