var FrameWatcher;
(function (FrameWatcher) {
    var Context = (function () {
        function Context(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            this.width = 0;
            this.height = 0;
            this.iframe = false;
            this.setSize(width, height);
            this.setMetadata();
        }
        Context.prototype.setMetadata = function () {
            this.iframe = ((window.location != window.parent.location) ? true : false);
            this.url = window.location.href;
            this.domain = window.location.hostname;
        };
        Context.prototype.getSize = function () {
            return { width: this.width, height: this.height };
        };
        Context.prototype.setSize = function (width, height) {
            if (width > 0 && height > 0) {
                this.width = width;
                this.height = height;
            }
            else {
                this.width = (window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth);
                this.height = (window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight);
            }
        };
        return Context;
    }());
    FrameWatcher.Context = Context;
})(FrameWatcher || (FrameWatcher = {}));
var FrameWatcher;
(function (FrameWatcher) {
    var Element = (function () {
        function Element(hookid, code) {
            this._viewed = false;
            var hook = document.getElementById(hookid);
            if (!(hook instanceof Object)) {
                throw new Error('Invalid hook id');
            }
            this.element = this.getHookParent(hook);
            this.id = this.element.id;
            this.code = code;
        }
        Element.prototype.getHookParent = function (hook) {
            return hook.parentElement;
        };
        Object.defineProperty(Element.prototype, "viewed", {
            get: function () {
                return this._viewed;
            },
            set: function (viewed) {
                this._viewed = viewed;
            },
            enumerable: true,
            configurable: true
        });
        Element.prototype.getSize = function () {
            return { width: this.element.offsetWidth, height: this.element.offsetHeight };
        };
        Element.prototype.getRects = function () {
            if (!(this.element instanceof Object)) {
                throw new Error('FrameElement element in not a proper object');
            }
            if ('getClientRects' in this.element) {
                this.rects = this.element.getClientRects()[0];
            }
            else {
                throw new Error('FrameElement can\'t get element rects');
            }
        };
        return Element;
    }());
    FrameWatcher.Element = Element;
})(FrameWatcher || (FrameWatcher = {}));
var FrameWatcher;
(function (FrameWatcher) {
    var Estimation = (function () {
        function Estimation(element, context) {
            this.element = element;
            this.context = context;
            this.runCalculation();
        }
        Estimation.prototype.runCalculation = function () {
            return this.calculate(this.element.getSize(), this.element.getRects(), this.context.getSize());
        };
        Estimation.prototype.calculate = function (elementSize, rects, contextSize) {
            var newHeight = elementSize.height;
            var newWidth = elementSize.width;
            var orginalSize = elementSize.height * elementSize.width;
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
            var newSize = newWidth * newHeight;
            var percent = Math.round((newSize / orginalSize) * Math.pow(10, 2)) / Math.pow(10, 2);
            if ((rects[0].bottom > 0 || rects[0].top > 0) && (rects[0].top < contextSize.height) && (rects[0].left < contextSize.width)) {
                return percent;
            }
        };
        return Estimation;
    }());
    FrameWatcher.Estimation = Estimation;
})(FrameWatcher || (FrameWatcher = {}));
var FrameWatcher;
(function (FrameWatcher) {
    var Runner = (function () {
        function Runner() {
            this._elements = [];
            this.context = new FrameWatcher.Context();
            this.bindScrollEvents();
        }
        Runner.prototype.bindScrollEvents = function () {
            var _this = this;
            window.addEventListener('resize', function () { _this.checkElements(); });
            window.addEventListener('scroll', function () { _this.checkElements(); });
        };
        Runner.prototype.checkElements = function () {
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var element = _a[_i];
            }
        };
        Runner.prototype.registerElement = function (hookid, code) {
            this._elements.push(new FrameWatcher.Element(hookid, code));
        };
        Object.defineProperty(Runner.prototype, "elements", {
            get: function () {
                return this._elements;
            },
            enumerable: true,
            configurable: true
        });
        return Runner;
    }());
    FrameWatcher.Runner = Runner;
})(FrameWatcher || (FrameWatcher = {}));
