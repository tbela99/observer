"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.times = void 0;
/**
 * a handler that is executed a given number of times
 * <code>
 *     const observer = new Observer;
 *
 *    observer.on('click:times(3)', () => console.log('click'));
 *    observer.trigger('click'); // 'click'
 *    observer.trigger('click'); // 'click'
 *    observer.trigger('click'); // 'click'
 *    observer.trigger('click'); // nothing ...
 *
 * @param name
 * @param handler
 * @param params
 */
function times(name, handler, params) {
    var counter = +params - 1;
    if (!Number.isInteger(counter)) {
        throw new Error("Invalid argument :times(int). expecting number, found ".concat(params));
    }
    if (counter < 0) {
        throw new Error("Invalid argument :times(arg). counter must be greater than 0, found ".concat(params));
    }
    // @ts-ignore
    var self = this;
    return function func() {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (counter-- === 0) {
            // @ts-ignore
            self.off(name, func);
        }
        handler.apply(void 0, args);
    };
}
exports.times = times;
