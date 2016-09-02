/// <reference path="Context.ts" />
/// <reference path="Element.ts" />

namespace FrameWatcher {

    interface Size {
        width: number;
        height: number;
    }

    interface Rects {
        top: number;
        left: number;
        bottom: number;
        right: number;
    }

    export class Estimation {

        private context;
        private element;

        constructor(element: Element, context: Context) {
            this.element = element;
            this.context = context;
            this.runCalculation();
        }

        runCalculation(): number {
            return this.calculate(
                this.element.getSize(),
                this.element.getRects(),
                this.context.getSize()
            );
        }

        calculate(elementSize: Size, rects: Rects, contextSize: Size): number {
            let percent: number = 0;
            let height: number = elementSize.height;
            let width: number = elementSize.width;
            let size: number = elementSize.height * elementSize.width;

            if (rects.top < 0) {
                height = elementSize.height + rects.top;
                height = height < 0 ? 0 : height;
                if (height > elementSize.height) height = elementSize.height;
            }
            if (contextSize.width < rects.right) {
                width = contextSize.width - rects.left;
                width = width < 0 ? 0 : width;
                if (width > elementSize.width) width = elementSize.width;
            }
            if (rects.bottom > contextSize.height) {
                height = elementSize.height - (rects.bottom - contextSize.height);
                height = height < 0 ? 0 : height;
                if (height > elementSize.height) height = elementSize.height;
            }
            if (rects.left < 0) {
                width = elementSize.width + rects.left;
                width = width < 0 ? 0 : width;
                if (width > elementSize.width) width = elementSize.width;
            }
            if (
                (rects.bottom > 0 || rects.top > 0) &&
                (rects.top < contextSize.height) &&
                (rects.left < contextSize.width)
            ) {
                percent = Math.round(((width * height) / size) * Math.pow(10, 2)) / Math.pow(10, 2);
            }
            return percent;
        }
    }
}