"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tslib_1 = require("tslib");
var MockIpcService = /** @class */ (function () {
    function MockIpcService() {
        this.onceListeners = {};
        this.listeners = {};
    }
    MockIpcService.prototype.send = function (channel) {
        var arg = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            arg[_i - 1] = arguments[_i];
        }
        if (this.onceListeners[channel] != null) {
            this.onceListeners[channel].forEach(function (element) {
                element.apply(void 0, tslib_1.__spread([channel], arg));
            });
            this.onceListeners[channel] = [];
        }
        if (this.listeners[channel] != null) {
            this.listeners[channel].forEach(function (element) {
                element.apply(void 0, tslib_1.__spread([channel], arg));
            });
        }
    };
    MockIpcService.prototype.on = function (channel, listener) {
        if (this.listeners[channel] == null) {
            this.listeners[channel] = [];
        }
        this.listeners[channel].push(listener);
    };
    MockIpcService.prototype.once = function (channel, listener) {
        if (this.onceListeners[channel] == null) {
            this.onceListeners[channel] = [];
        }
        this.onceListeners[channel].push(listener);
    };
    MockIpcService.prototype.removeListener = function (channel, listener) {
        if (this.onceListeners[channel] != null) {
            var find = this.onceListeners[channel].findIndex(function (value) {
                return listener.name === value.name;
            });
            if (find >= 0) {
                this.onceListeners[channel].splice(find, 1);
            }
        }
        if (this.listeners[channel] != null) {
            var find = this.listeners[channel].findIndex(function (value) {
                return listener.name === value.name;
            });
            if (find >= 0) {
                this.listeners[channel].splice(find, 1);
            }
        }
    };
    MockIpcService.prototype.removeAllListeners = function (channel) {
        this.onceListeners[channel] = [];
        this.listeners[channel] = [];
    };
    MockIpcService.prototype.removeListenersFromAllChannels = function () {
        this.onceListeners = {};
        this.listeners = {};
    };
    return MockIpcService;
}());
exports.MockIpcService = MockIpcService;
//# sourceMappingURL=mock-ipc.service.js.map