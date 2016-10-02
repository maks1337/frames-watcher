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
            this.calculate();
        }

        lessThanZero(value): number {
            return value < 0 ? 0 : value;
        }

        inView(rects, contextSize): boolean {
            const topBottomRectsGreaterThanZero = rects.bottom > 0 || rects.top > 0;
            const topRectsInHeight = rects.top < contextSize.height;
            const leftRectsInWidth = rects.left < contextSize.width;
            return topBottomRectsGreaterThanZero && topRectsInHeight && leftRectsInWidth;
        }

        percent(width, height, size): number {
            return Math.round(((width * height) / size) * Math.pow(10, 2)) / Math.pow(10, 2);
        }

        greaterThanElementSize(distance, value): number {
            const distanceValue = this.element.getSize().$distance;
            value = this.lessThanZero(value);
            return value > distanceValue ? distanceValue : value;
        }

        calculate(): number {
            const rects = this.element.getRects();
            const context = this.context.getSize();

            let height: number = this.element.getSize().height;
            let width: number = this.element.getSize().width;
            let size: number = this.element.getSize().height * this.element.getSize().width;

            if (rects.top < 0)
                height = this.greaterThanElementSize("height", height + rects.top);
            if (context.width < rects.right)
                width = this.greaterThanElementSize("width", context.width - rects.left);
            if (rects.bottom > context.height)
                height = this.greaterThanElementSize("height", rects.bottom - context.height);
            if (rects.left < 0)
                width = this.greaterThanElementSize("width", width + rects.left);

            return this.inView(rects, context) ? this.percent(width, height, size) : 0;
        }
    }
}