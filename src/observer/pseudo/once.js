"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.once = void 0;
/**
 * a handler that is executed only once
 * <code>
 *     const observer = new Observer;
 *
 *    observer.on('click:once', () => console.log('click'));
 *    observer.trigger('click'); // 'click'
 *    observer.trigger('click'); // nothing ...
 *
 * @param name
 * @param handler
 */
function once(name, handler) {
    // @ts-ignore
    var self = this;
    return function func() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        handler.apply(void 0, args);
        // @ts-ignore
        self.off(name, func);
    };
}
exports.once = once;
