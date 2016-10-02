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
            return this.calculate();
        }

        lessThanZero(value): number {
            return value < 0 ? 0 : value;
        }

        inView(rects, contextSize): boolean {
            return (rects.bottom > 0 || rects.top > 0)
            && (rects.top < contextSize.height)
            && (rects.left < contextSize.width);
        }

        percent(width, height, size): number {
            return Math.round(((width * height) / size) * Math.pow(10, 2)) / Math.pow(10, 2);
        }

        greaterThanElementSize(distance, value): number {
            value = this.lessThanZero(value);
            if (value > this.element.getSize().$distance) {
                return this.element.getSize().$distance;
            }else {
                return value;
            }
        }

        calculate(): number {
            const rects = this.element.getRects();
            const context = this.context.getSize();

            let height: number = this.element.getSize().height;
            let width: number = this.element.getSize().width;
            let size: number = this.element.getSize().height * this.element.getSize().width;

            if (rects.top < 0) {
                height = this.greaterThanElementSize("height", height + rects.top);
            }
            if (context.width < rects.right) {
                width = this.greaterThanElementSize("width", context.width - rects.left);
            }
            if (rects.bottom > context.height) {
                height = this.greaterThanElementSize("height", rects.bottom - context.height);
            }
            if (rects.left < 0) {
                width = this.greaterThanElementSize("width", width + rects.left);
            }
            if (this.inView(rects, context)) {
                return this.percent(width, height, size);
            }else {
                return 0;
            }
        }
    }
}