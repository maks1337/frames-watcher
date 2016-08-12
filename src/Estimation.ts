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

        runCalculation(){

            return this.calculate(
                this.element.getSize(),
                this.element.getRects(),
                this.context.getSize()
            );

        }

        calculate(elementSize: Size,rects:Rects,contextSize: Size){

            let newHeight = elementSize.height;
            let newWidth = elementSize.width;
            let orginalSize = elementSize.height * elementSize.width;

            if (rects[0].top < 0) {
                newHeight = elementSize.height + rects[0].top;
                if (newHeight < 0) {
                    newHeight = 0;
                }
                if (newHeight > elementSize.height) {
                    newHeight = elementSize.height;
                }
            }
            if (contextSize.width < rects[0].right) {
                newWidth = contextSize.width - rects[0].left;
                if (newWidth < 0) {
                    newWidth = 0;
                }
                if (newWidth > elementSize.width) {
                    newWidth = elementSize.width;
                }
            }
            if (rects[0].bottom > contextSize.height) {
                newHeight = elementSize.height - (rects[0].bottom - contextSize.height);
                if (newHeight < 0) {
                    newHeight = 0;
                }
                if (newHeight > elementSize.height) {
                    newHeight = elementSize.height;
                }
            }
            if (rects[0].left < 0) {
                newWidth = elementSize.width + rects[0].left;
                if (newWidth < 0) {
                    newWidth = 0;
                }
                if (newWidth > elementSize.width) {
                    newWidth = elementSize.width;
                }
            }
            let newSize = newWidth * newHeight;
            var percent = Math.round((newSize / orginalSize) * Math.pow(10, 2)) / Math.pow(10, 2);

            if ((rects[0].bottom > 0 || rects[0].top > 0) && (rects[0].top < contextSize.height) && (rects[0].left < contextSize.width)) {
                return percent;
            }

        }
    }
}