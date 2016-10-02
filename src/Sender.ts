/// <reference path="Context.ts" />
/// <reference path="Element.ts" />
/// <reference path="Estimation.ts" />
/// <reference path="Strategies.ts" />

namespace FrameWatcher {

    type possibleSenders = HttpSender | SocketSender | ConsoleSender;

    /**
    * Fast UUID generator, RFC4122 version 4 compliant.
    * @author Jeff Ward (jcward.com).
    * @license MIT license
    * @link http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript/21963136#21963136
    **/
    export class UUID {
        constructor() {
            let self = {};
            let lut = []; for (let i = 0; i < 256; i++) { lut[i] = (i < 16 ? "0" : "") + (i).toString(16); }
            const d0 = Math.random() * 0xffffffff | 0;
            const d1 = Math.random() * 0xffffffff | 0;
            const d2 = Math.random() * 0xffffffff | 0;
            const d3 = Math.random() * 0xffffffff | 0;
            return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + "-" +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + "-" + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + "-" +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + "-" + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
        }
    }

    export class Data {
        private _data: Object;
        constructor(element: Element, cookie: string, viewId: string) {
            this._data = {
                code: element.code,
                placement: element.id,
                view: (viewId) ? viewId : new UUID()
            };
            if (cookie) this._data["cookie"] = cookie;
            element.viewed.forEach((a) => this._data[`strat-${a[0]}`] = a[1]);
        }

        get data(): Object {
            return this._data;
        }
    }

    export class Sender {

        protected url: string = undefined;
        protected _cookie: string = undefined;
        protected _viewId: string = undefined;
        protected elements: Array<Element>;

        constructor(url: string) {
            this.url = url;
        }

        get cookie(){
            return this._cookie;
        }

        set cookie(cookie: string){
            this._cookie = cookie;
        }

        get viewId(){
            return this._viewId;
        }

        set viewId(viewId: string){
            this._viewId = viewId;
        }

        loadElements(elements: Array<Element>): void {
            this.elements = elements;
        }

        prepareData(): Array<Object> {
            let send: boolean = true;
            let currentData: Array<Object> = [];

            this.elements.forEach((element) => {

                let dataClass = new Data(element, this._cookie, this._viewId);
                currentData.push(dataClass.data);

            });
            return currentData;
        }
    }

    export class HttpSender extends Sender {
        send(): boolean {
            let data = this.prepareData();
            return true;
        }
    }

    export class SocketSender extends Sender {
        send(): boolean {
            let data = this.prepareData();
            return true;
        }
    }

    export class ConsoleSender extends Sender {
        private headerDrawn: boolean = false;
        send(): boolean {

            let data = this.prepareData();
            const allowedData: Array<string> = ["placement", "strat-basic"];
            data.forEach((element) => {
                let dataString: Array<string> = [];
                for (let key in element) {
                    if (allowedData.indexOf(key) > -1) {
                        dataString.push(`${element[key]}`);
                    }
                }
                console.log(this.url, dataString.join(" "));
            });

            return true;
        }
    }

    export class SenderSelect {
        private sender: possibleSenders;
        constructor(type: string, url: string) {
            if (type === "http") {
                this.sender = new HttpSender(url);
            }
            if (type === "socket") {
                this.sender = new SocketSender(url);
            }
            if (type === "console") {
                this.sender = new ConsoleSender(url);
            }
            if (!this.sender.hasOwnProperty("url")) {
                throw new Error(`invalid sender requested: ${type}`);
            }
        }
        returnObject(): possibleSenders {
            return this.sender;
        }
    }
}