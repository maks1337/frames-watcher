/// <reference path="Context.ts" />
/// <reference path="Element.ts" />

namespace FrameWatcher {

    interface Size {
        width: number;
        height: number;
    }

    interface Rects { 
        top: number, 
        left: number,
        bottom: number,
        right: number
    }

    export class Estimation {

        private context;
        private element;

        constructor(element:Element,context:Context){

            this.element = element;
            this.context = context;
            this.runCalculation();

        }

        runCalculation():number{

            return this.calculate(
                this.element.getSize(),
                this.element.getRects(),
                this.context.getSize()
            );

        }

        calculate(elementSize: Size,rects:Rects,contextSize: Size):number{

            let percent: number = 0;
            let newHeight: number = elementSize.height;
            let newWidth: number = elementSize.width;
            let orginalSize: number = elementSize.height * elementSize.width;

            if (rects.top < 0) {
                newHeight = elementSize.height + rects.top;
                newHeight = newHeight < 0 ? 0 : newHeight;
                if (newHeight > elementSize.height) newHeight = elementSize.height;
            }
            if (contextSize.width < rects.right) {
                newWidth = contextSize.width - rects.left;
                newWidth = newWidth < 0 ? 0 : newWidth;
                if (newWidth > elementSize.width) newWidth = elementSize.width;
            }
            if (rects.bottom > contextSize.height) {
                newHeight = elementSize.height - (rects.bottom - contextSize.height);
                newHeight = newHeight < 0 ? 0 : newHeight;
                if (newHeight > elementSize.height) newHeight = elementSize.height;
            }
            if (rects.left < 0) {
                newWidth = elementSize.width + rects.left;
                newWidth = newWidth < 0 ? 0 : newWidth;
                if (newWidth > elementSize.width) newWidth = elementSize.width;
            }
            
            let newSize: number = newWidth * newHeight;
            
            if ((rects.bottom > 0 || rects.top > 0) && (rects.top < contextSize.height) && (rects.left < contextSize.width)) {
                percent = Math.round((newSize / orginalSize) * Math.pow(10, 2)) / Math.pow(10, 2);
            }

            return percent;

        }
    }
}