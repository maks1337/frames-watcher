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
            this.viewed = {};
            this._timeline = [];
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
        Element.prototype.getTimeline = function () {
            return this._timeline;
        };
        Element.prototype.addToTimeline = function (visibility) {
            if (visibility > 0) {
                this._timeline.push(visibility);
            }
        };
        Element.prototype.getSize = function () {
            return { width: this.element.offsetWidth, height: this.element.offsetHeight };
        };
        Element.prototype.getRects = function () {
            if (!(this.element instanceof Object)) {
                throw new Error('FrameElement element in not a proper object');
            }
            if ('getClientRects' in this.element) {
                this.rects = this.element.getClientRects()[0];
                return this.rects;
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
            var percent = 0;
            var newHeight = elementSize.height;
            var newWidth = elementSize.width;
            var orginalSize = elementSize.height * elementSize.width;
            if (rects.top < 0) {
                newHeight = elementSize.height + rects.top;
                if (newHeight < 0)
                    newHeight = 0;
                if (newHeight > elementSize.height)
                    newHeight = elementSize.height;
            }
            if (contextSize.width < rects.right) {
                newWidth = contextSize.width - rects.left;
                if (newWidth < 0)
                    newWidth = 0;
                if (newWidth > elementSize.width)
                    newWidth = elementSize.width;
            }
            if (rects.bottom > contextSize.height) {
                newHeight = elementSize.height - (rects.bottom - contextSize.height);
                if (newHeight < 0)
                    newHeight = 0;
                if (newHeight > elementSize.height)
                    newHeight = elementSize.height;
            }
            if (rects.left < 0) {
                newWidth = elementSize.width + rects.left;
                if (newWidth < 0)
                    newWidth = 0;
                if (newWidth > elementSize.width)
                    newWidth = elementSize.width;
            }
            var newSize = newWidth * newHeight;
            if ((rects.bottom > 0 || rects.top > 0) && (rects.top < contextSize.height) && (rects.left < contextSize.width)) {
                percent = Math.round((newSize / orginalSize) * Math.pow(10, 2)) / Math.pow(10, 2);
            }
            return percent;
        };
        return Estimation;
    }());
    FrameWatcher.Estimation = Estimation;
})(FrameWatcher || (FrameWatcher = {}));
var FrameWatcher;
(function (FrameWatcher) {
    var BasicStrategy = (function () {
        function BasicStrategy() {
            this.name = 'basic';
        }
        BasicStrategy.prototype.validate = function (timeline) {
            return (timeline.sort()[timeline.length - 1] >= 0.5);
        };
        return BasicStrategy;
    }());
    FrameWatcher.BasicStrategy = BasicStrategy;
    var FullStrategy = (function () {
        function FullStrategy() {
            this.name = 'full';
        }
        FullStrategy.prototype.validate = function (timeline) {
            return (timeline.sort()[timeline.length - 1] == 1);
        };
        return FullStrategy;
    }());
    FrameWatcher.FullStrategy = FullStrategy;
    var LongStrategy = (function () {
        function LongStrategy() {
            this.name = 'long';
        }
        LongStrategy.prototype.validate = function (timeline) {
            var counts = timeline.reduce(function (acc, curr) {
                acc[curr] ? acc[curr]++ : acc[curr] = 1;
                return acc;
            }, {});
            return counts['1'] ? counts['1'] >= 5 : counts['1'] < 5;
        };
        return LongStrategy;
    }());
    FrameWatcher.LongStrategy = LongStrategy;
    var StrategyCheck = (function () {
        function StrategyCheck(strategy) {
            this.strategy = strategy;
            this.name = strategy.name;
        }
        StrategyCheck.prototype.run = function (timeline) {
            return this.strategy.validate(timeline);
        };
        return StrategyCheck;
    }());
    FrameWatcher.StrategyCheck = StrategyCheck;
})(FrameWatcher || (FrameWatcher = {}));
var FrameWatcher;
(function (FrameWatcher) {
    var Runner = (function () {
        function Runner() {
            this._elements = [];
            this._debug = false;
            this._intervalTickRate = 1000;
            this._timeLimit = (1000 * 60) * 10;
            this._timeElapsed = this._intervalTickRate;
            this._strategies = [];
            this.context = new FrameWatcher.Context();
            this.bindRuntime();
            var basic = new FrameWatcher.StrategyCheck(new FrameWatcher.BasicStrategy());
            var full = new FrameWatcher.StrategyCheck(new FrameWatcher.FullStrategy());
            var long = new FrameWatcher.StrategyCheck(new FrameWatcher.LongStrategy());
            this._strategies[basic.name] = basic;
            this._strategies[full.name] = full;
            this._strategies[long.name] = long;
        }
        Object.defineProperty(Runner.prototype, "debug", {
            get: function () {
                return this._debug;
            },
            set: function (debug) {
                this._debug = debug;
            },
            enumerable: true,
            configurable: true
        });
        Runner.prototype.bindRuntime = function () {
            var _this = this;
            window.addEventListener('resize', function () { _this.context.setSize(0, 0); });
            this._interval = setInterval(function () {
                _this.checkElements();
                _this._timeElapsed += _this._intervalTickRate;
                _this.expireRuntime();
            }, this._intervalTickRate);
        };
        Runner.prototype.expireRuntime = function () {
            if (this._timeElapsed >= this._timeLimit) {
                clearInterval(this._interval);
                return true;
            }
            return false;
        };
        Runner.prototype.checkElements = function () {
            if (this._debug === true) {
                console.log("------ second: " + this._timeElapsed / 1000);
            }
            for (var _i = 0, _a = this._elements; _i < _a.length; _i++) {
                var element = _a[_i];
                var estimation = new FrameWatcher.Estimation(element, this.context);
                var percent = estimation.runCalculation();
                element.addToTimeline(percent);
                for (var name_1 in this._strategies) {
                    var strategy = this._strategies[name_1];
                    element.viewed[strategy.name] = strategy.run(element.getTimeline());
                }
                if (this._debug === true) {
                    console.log(element.id, element.code, percent, element.viewed);
                }
            }
        };
        Runner.prototype.registerElement = function (hookid, code) {
            this._elements.push(new FrameWatcher.Element(hookid, code));
            this.checkElements();
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
