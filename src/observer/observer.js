"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Observer_handlers, _Observer_pseudo;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
var pseudos = require("./pseudo");
var Observer = /** @class */ (function () {
    function Observer() {
        _Observer_handlers.set(this, new Map);
        _Observer_pseudo.set(this, new Map);
        for (var _i = 0, _a = Object.entries(pseudos); _i < _a.length; _i++) {
            var entry = _a[_i];
            this.definePseudo(entry[0], entry[1]);
        }
    }
    Observer.prototype.on = function (name, handler) {
        var match = name.match(/(.*):([^:()]+)(\((.*?)\))?$/);
        if (match != null && __classPrivateFieldGet(this, _Observer_pseudo, "f").has(match[2])) {
            name = match[1];
            handler = __classPrivateFieldGet(this, _Observer_pseudo, "f").get(match[2])(name, handler, match[4]);
            console.log({ name: name, handler: handler.toString() });
        }
        if (!__classPrivateFieldGet(this, _Observer_handlers, "f").has(name)) {
            __classPrivateFieldGet(this, _Observer_handlers, "f").set(name, new Set);
        }
        __classPrivateFieldGet(this, _Observer_handlers, "f").get(name).add(handler);
        return this;
    };
    Observer.prototype.off = function (name, handler) {
        if (handler == null) {
            __classPrivateFieldGet(this, _Observer_handlers, "f").delete(name);
        }
        else if (__classPrivateFieldGet(this, _Observer_handlers, "f").has(name)) {
            __classPrivateFieldGet(this, _Observer_handlers, "f").get(name).delete(handler);
            if (__classPrivateFieldGet(this, _Observer_handlers, "f").get(name).size === 0) {
                __classPrivateFieldGet(this, _Observer_handlers, "f").delete(name);
            }
        }
        return this;
    };
    Observer.prototype.trigger = function (name) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (__classPrivateFieldGet(this, _Observer_handlers, "f").has(name)) {
            for (var _a = 0, _b = __classPrivateFieldGet(this, _Observer_handlers, "f").get(name); _a < _b.length; _a++) {
                var handler = _b[_a];
                handler.apply(void 0, args);
            }
        }
    };
    Observer.prototype.definePseudo = function (pseudo, parser) {
        __classPrivateFieldGet(this, _Observer_pseudo, "f").set(pseudo, parser.bind(this));
    };
    return Observer;
}());
exports.Observer = Observer;
_Observer_handlers = new WeakMap(), _Observer_pseudo = new WeakMap();
