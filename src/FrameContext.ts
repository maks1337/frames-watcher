class FrameContext {

    private url: string;
    private domain: string;
    private frames: Object;
    private width: number = 0;
    private height: number = 0;
    private iframe: boolean = false;

    construct(){

        this.setSize(0,0);
        this.setMetadata();

    }

    setMetadata(){

        this.iframe = ((window.location != window.parent.location) ? true : false);
        this.url = window.location.href;
        this.domain = window.location.hostname;

    }

    setSize(width: number, height: number){

        if(width > 0 && height > 0){

            this.width = width;
            this.height = height;

        }else{
            this.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
            this.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);   
        }

    }

}