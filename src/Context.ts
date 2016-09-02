/// <reference path="Namespace.ts" />

namespace FrameWatcher {

    export class Context {

        url: string;
        domain: string;
        private frames: Object;
        protected width: number = 0;
        protected height: number = 0;
        protected iframe: boolean = false;

        constructor(width: number= 0, height: number= 0) {

            this.setSize(width, height);
            this.setMetadata();

        }

        setMetadata(): void {

            this.iframe = ((window.location !== window.parent.location) ? true : false);
            this.url = window.location.href;
            this.domain = window.location.hostname;

        }
        getSize(): Object {

            return { width: this.width, height: this.height };

        }

        setSize(width: number, height: number): void {

            if (width > 0 && height > 0) {

                this.width = width;
                this.height = height;

            }else {
                this.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
                this.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
            }

        }

    }

}