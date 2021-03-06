var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
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
            this.iframe = ((window.location !== window.parent.location) ? true : false);
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
            this.viewed = [];
            this._timeline = [];
            var hook = document.getElementById(hookid);
            if (!(hook instanceof Object)) {
                throw new Error("Invalid hook id");
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
                throw new Error("FrameElement element in not a proper object");
            }
            if ("getClientRects" in this.element) {
                this.rects = this.element.getClientRects()[0];
                return this.rects;
            }
            else {
                throw new Error("FrameElement can\'t get element rects");
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
            this.calculate();
        }
        Estimation.prototype.lessThanZero = function (value) {
            return value < 0 ? 0 : value;
        };
        Estimation.prototype.inView = function (rects, contextSize) {
            var topBottomRectsGreaterThanZero = rects.bottom > 0 || rects.top > 0;
            var topRectsInHeight = rects.top < contextSize.height;
            var leftRectsInWidth = rects.left < contextSize.width;
            return topBottomRectsGreaterThanZero && topRectsInHeight && leftRectsInWidth;
        };
        Estimation.prototype.percent = function (width, height, size) {
            return Math.round(((width * height) / size) * Math.pow(10, 2)) / Math.pow(10, 2);
        };
        Estimation.prototype.greaterThanElementSize = function (distance, value) {
            var distanceValue = this.element.getSize().$distance;
            value = this.lessThanZero(value);
            return value > distanceValue ? distanceValue : value;
        };
        Estimation.prototype.calculate = function () {
            var rects = this.element.getRects();
            var context = this.context.getSize();
            var height = this.element.getSize().height;
            var width = this.element.getSize().width;
            var size = this.element.getSize().height * this.element.getSize().width;
            if (rects.top < 0)
                height = this.greaterThanElementSize("height", height + rects.top);
            if (context.width < rects.right)
                width = this.greaterThanElementSize("width", context.width - rects.left);
            if (rects.bottom > context.height)
                height = this.greaterThanElementSize("height", rects.bottom - context.height);
            if (rects.left < 0)
                width = this.greaterThanElementSize("width", width + rects.left);
            return this.inView(rects, context) ? this.percent(width, height, size) : 0;
        };
        return Estimation;
    }());
    FrameWatcher.Estimation = Estimation;
})(FrameWatcher || (FrameWatcher = {}));
var FrameWatcher;
(function (FrameWatcher) {
    var BasicStrategy = (function () {
        function BasicStrategy() {
            this.NAME = "basic";
        }
        BasicStrategy.prototype.validate = function (timeline) {
            return (timeline.sort()[timeline.length - 1] >= 0.5);
        };
        return BasicStrategy;
    }());
    FrameWatcher.BasicStrategy = BasicStrategy;
    var FullStrategy = (function () {
        function FullStrategy() {
            this.NAME = "full";
        }
        FullStrategy.prototype.validate = function (timeline) {
            return (timeline.sort()[timeline.length - 1] === 1);
        };
        return FullStrategy;
    }());
    FrameWatcher.FullStrategy = FullStrategy;
    var LongStrategy = (function () {
        function LongStrategy() {
            this.NAME = "long";
        }
        LongStrategy.prototype.validate = function (timeline) {
            var counts = timeline.reduce(function (acc, curr) {
                acc[curr] ? acc[curr]++ : acc[curr] = 1;
                return acc;
            }, {});
            return counts["1"] ? counts["1"] >= 5 : counts["1"] < 5;
        };
        return LongStrategy;
    }());
    FrameWatcher.LongStrategy = LongStrategy;
    var TimeStrategy = (function () {
        function TimeStrategy() {
            this.NAME = "time";
        }
        TimeStrategy.prototype.validate = function (timeline) {
            var counts = timeline.reduce(function (acc, curr) {
                acc[curr] ? acc[curr]++ : acc[curr] = 1;
                return acc;
            }, {});
            return counts["1"] ? counts["1"] >= 5 : counts["1"] < 5;
        };
        return TimeStrategy;
    }());
    FrameWatcher.TimeStrategy = TimeStrategy;
    var StrategyCheck = (function () {
        function StrategyCheck(strategy) {
            this.strategy = strategy;
            this.name = strategy.NAME;
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
    var UUID = (function () {
        function UUID() {
        }
        UUID.prototype.get = function () {
            var self = {};
            var lut = [];
            for (var i = 0; i < 256; i++) {
                lut[i] = (i < 16 ? "0" : "") + (i).toString(16);
            }
            var d0 = Math.random() * 0xffffffff | 0;
            var d1 = Math.random() * 0xffffffff | 0;
            var d2 = Math.random() * 0xffffffff | 0;
            var d3 = Math.random() * 0xffffffff | 0;
            return lut[d0 & 0xff] + lut[d0 >> 8 & 0xff] + lut[d0 >> 16 & 0xff] + lut[d0 >> 24 & 0xff] + "-" +
                lut[d1 & 0xff] + lut[d1 >> 8 & 0xff] + "-" + lut[d1 >> 16 & 0x0f | 0x40] + lut[d1 >> 24 & 0xff] + "-" +
                lut[d2 & 0x3f | 0x80] + lut[d2 >> 8 & 0xff] + "-" + lut[d2 >> 16 & 0xff] + lut[d2 >> 24 & 0xff] +
                lut[d3 & 0xff] + lut[d3 >> 8 & 0xff] + lut[d3 >> 16 & 0xff] + lut[d3 >> 24 & 0xff];
        };
        return UUID;
    }());
    FrameWatcher.UUID = UUID;
    var Data = (function () {
        function Data(element, cookie, viewId) {
            var _this = this;
            this._data = {
                code: element.code,
                placement: element.id,
                view: viewId
            };
            if (cookie)
                this._data["cookie"] = cookie;
            element.viewed.forEach(function (a) { return _this._data["strat-" + a[0]] = a[1]; });
        }
        Object.defineProperty(Data.prototype, "data", {
            get: function () {
                return this._data;
            },
            enumerable: true,
            configurable: true
        });
        return Data;
    }());
    FrameWatcher.Data = Data;
    var Sender = (function () {
        function Sender(url) {
            this.url = undefined;
            this._cookie = undefined;
            this._viewId = undefined;
            this.url = url;
        }
        Object.defineProperty(Sender.prototype, "cookie", {
            get: function () {
                return this._cookie;
            },
            set: function (cookie) {
                this._cookie = cookie;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Sender.prototype, "viewId", {
            get: function () {
                return this._viewId;
            },
            set: function (viewId) {
                this._viewId = viewId;
            },
            enumerable: true,
            configurable: true
        });
        Sender.prototype.loadElements = function (elements) {
            this.elements = elements;
        };
        Sender.prototype.prepareData = function () {
            var _this = this;
            var send = true;
            var currentData = [];
            this.elements.forEach(function (element) {
                var dataClass = new Data(element, _this._cookie, _this._viewId);
                currentData.push(dataClass.data);
            });
            return currentData;
        };
        return Sender;
    }());
    FrameWatcher.Sender = Sender;
    var HttpSender = (function (_super) {
        __extends(HttpSender, _super);
        function HttpSender() {
            return _super.apply(this, arguments) || this;
        }
        HttpSender.prototype.generateUrlForData = function (element, prefix) {
            var subQuery = [];
            for (var key in element) {
                subQuery.push(key + "[" + prefix + "]=" + element[key]);
            }
            return subQuery.join("&");
        };
        HttpSender.prototype.prepareUrl = function () {
            var query = [];
            var data = this.prepareData();
            var prefix = 0;
            for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
                var element = data_1[_i];
                query.push(this.generateUrlForData(element, prefix));
                prefix++;
            }
            return "?=" + query.join("&");
        };
        HttpSender.prototype.checkLastUrl = function (url) {
            return url !== this.lastUrl;
        };
        HttpSender.prototype.setLastUrl = function (url) {
            this.lastUrl = url;
        };
        HttpSender.prototype.send = function () {
            var url = this.prepareUrl();
            if (this.checkLastUrl(url)) {
                this.setLastUrl(url);
                var sendDataImage = document.createElement("img");
                sendDataImage.src = url + "&stamp=" + new Date().getTime();
            }
            return true;
        };
        return HttpSender;
    }(Sender));
    FrameWatcher.HttpSender = HttpSender;
    var SocketSender = (function (_super) {
        __extends(SocketSender, _super);
        function SocketSender() {
            return _super.apply(this, arguments) || this;
        }
        SocketSender.prototype.send = function () {
            var data = this.prepareData();
            return true;
        };
        return SocketSender;
    }(Sender));
    FrameWatcher.SocketSender = SocketSender;
    var ConsoleSender = (function (_super) {
        __extends(ConsoleSender, _super);
        function ConsoleSender() {
            return _super.apply(this, arguments) || this;
        }
        ConsoleSender.prototype.send = function () {
            var _this = this;
            var data = this.prepareData();
            var allowedData = ["placement", "strat-basic"];
            data.forEach(function (element) {
                var dataString = [];
                for (var key in element) {
                    if (allowedData.indexOf(key) > -1) {
                        dataString.push("" + element[key]);
                    }
                }
                console.log(_this.url, dataString.join(" "));
            });
            return true;
        };
        return ConsoleSender;
    }(Sender));
    FrameWatcher.ConsoleSender = ConsoleSender;
    var SenderSelect = (function () {
        function SenderSelect(type, url) {
            if (type === "http")
                this.sender = new HttpSender(url);
            if (type === "socket")
                this.sender = new SocketSender(url);
            if (type === "console")
                this.sender = new ConsoleSender(url);
            if (!this.sender.hasOwnProperty("url"))
                throw new Error("invalid sender requested: " + type);
        }
        SenderSelect.prototype.returnObject = function () {
            return this.sender;
        };
        return SenderSelect;
    }());
    FrameWatcher.SenderSelect = SenderSelect;
})(FrameWatcher || (FrameWatcher = {}));
var FrameWatcher;
(function (FrameWatcher) {
    var Runner = (function () {
        function Runner(sender, senderUrl, cookie, viewId) {
            if (sender === void 0) { sender = "http"; }
            if (cookie === void 0) { cookie = undefined; }
            if (viewId === void 0) { viewId = undefined; }
            this.tickRate = 1000;
            this.timeLimit = (1000 * 60) * 10;
            this._elements = [];
            this._debug = false;
            this._timeElapsed = this.tickRate;
            this._strategies = [];
            this.context = new FrameWatcher.Context();
            this.loadStrategies();
            try {
                var select = new FrameWatcher.SenderSelect(sender, senderUrl);
                this._sender = select.returnObject();
                this._sender.cookie = cookie;
                this._sender.viewId = (viewId) ? viewId : new FrameWatcher.UUID().get();
                this.bindRuntime();
            }
            catch (error) {
                console.log("Runner not started because: " + error);
            }
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
        Object.defineProperty(Runner.prototype, "sender", {
            get: function () {
                return this._sender;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Runner.prototype, "elements", {
            get: function () {
                return this._elements;
            },
            enumerable: true,
            configurable: true
        });
        Runner.prototype.sendData = function () {
            this._sender.loadElements(this._elements);
            this._sender.send();
        };
        Runner.prototype.loadStrategies = function () {
            var basic = new FrameWatcher.StrategyCheck(new FrameWatcher.BasicStrategy());
            var full = new FrameWatcher.StrategyCheck(new FrameWatcher.FullStrategy());
            var long = new FrameWatcher.StrategyCheck(new FrameWatcher.LongStrategy());
            var time = new FrameWatcher.StrategyCheck(new FrameWatcher.TimeStrategy());
            this._strategies[basic.name] = basic;
            this._strategies[full.name] = full;
            this._strategies[long.name] = long;
            this._strategies[time.name] = time;
        };
        Runner.prototype.run = function () {
            try {
                this.checkElements();
                this._timeElapsed += this.tickRate;
                this.expireRuntime();
                this.sendData();
            }
            catch (error) {
                console.log("runtime stopped " + error);
                this.expireRuntime(true);
            }
        };
        Runner.prototype.bindRuntime = function () {
            var _this = this;
            this.run();
            window.addEventListener("resize", function () { _this.context.setSize(0, 0); });
            this._interval = setInterval(function () { return _this.run(); }, this.tickRate);
        };
        Runner.prototype.expireRuntime = function (force) {
            if (force === void 0) { force = false; }
            if (this._timeElapsed >= this.timeLimit || force) {
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
                var percent = estimation.calculate();
                element.addToTimeline(percent);
                element.viewed = [];
                for (var name_1 in this._strategies) {
                    var strategy = this._strategies[name_1];
                    element.viewed.push([
                        strategy.name,
                        strategy.run(element.getTimeline())
                    ]);
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
        return Runner;
    }());
    FrameWatcher.Runner = Runner;
})(FrameWatcher || (FrameWatcher = {}));
