/**
 * a handler that is executed only once
 * <code>
 *     const observer = new Observer;
 *
 *    observer.on('click:once', () => console.log('click'));
 *    observer.trigger('click'); // 'click'
 *    observer.trigger('click'); // nothing ...
 *
 */
function once(name, handler, params, observer) {
    return function (...args) {
        handler(...args);
        observer.off(name, handler);
    };
}

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
 */
function times(name, handler, params, observer) {
    let counter = +params - 1;
    if (!Number.isInteger(counter)) {
        throw new Error(`Invalid argument :times(int). expecting number, found ${params}`);
    }
    if (counter < 0) {
        throw new Error(`Invalid argument :times(arg). counter must be greater than 0, found ${params}`);
    }
    return (...args) => {
        if (counter-- === 0) {
            observer.off(name, handler);
        }
        handler(...args);
    };
}

/**
 * a handler that is executed a given number of times
 * <code>
 *     const observer = new Observer;
 *
 *    observer.on('click:debounce(250)', () => console.log('click'));
 *    observer.trigger('click'); //  nothing ...
 *    observer.trigger('click'); //  nothing ...
 *    observer.trigger('click'); //  nothing ...
 *    observer.trigger('click'); // 'click' after at least 250ms since the last call
 *
 */
function debounce(name, handler, params) {
    let duration = +params;
    if (!Number.isInteger(duration)) {
        throw new Error(`Invalid argument :debounce(int). expecting number, found ${params}`);
    }
    if (duration < 0) {
        throw new Error(`Invalid argument :debounce(arg). counter must be greater or equal to 0, found ${params}`);
    }
    // @ts-ignore
    let timer = null;
    return (...args) => {
        if (timer != null) {
            clearTimeout(timer);
        }
        timer = setTimeout(() => handler(...args), duration);
    };
}

/**
 * a handler that is executed a given number of times
 * <code>
 *     const observer = new Observer;
 *
 *    observer.on('click:debounce(250)', () => console.log('click'));
 *    observer.trigger('click'); //  nothing ...
 *    observer.trigger('click'); //  nothing ...
 *    observer.trigger('click'); //  nothing ...
 *    observer.trigger('click'); // 'click' after at least 250ms since the last call
 *
 */
function throttle(name, handler, params) {
    let duration = +params;
    if (!Number.isInteger(duration)) {
        throw new Error(`Invalid argument :throttle(int). expecting number, found ${params}`);
    }
    if (duration < 0) {
        throw new Error(`Invalid argument :throttle(arg). counter must be greater or equal to 0, found ${params}`);
    }
    // @ts-ignore
    let timer = null;
    return (...args) => {
        if (timer != null) {
            return;
        }
        timer = setTimeout(() => {
            timer = null;
            handler(...args);
        }, duration);
    };
}

var pseudos = /*#__PURE__*/Object.freeze({
    __proto__: null,
    debounce: debounce,
    once: once,
    throttle: throttle,
    times: times
});

class Observer {
    #handlers = new Map;
    #pseudo = new Map;
    constructor() {
        for (const entry of Object.entries(pseudos)) {
            // @ts-ignore
            this.definePseudo(entry[0], entry[1]);
        }
    }
    on(name, handler, signal) {
        const match = name.match(/(.*):([^:()]+)(\((.*?)\))?$/);
        let callback = handler;
        if (match != null && this.#pseudo.has(match[2])) {
            name = match[1];
            // @ts-ignore
            callback = this.#pseudo.get(match[2])(name, handler, match[4], this);
        }
        if (!this.#handlers.has(name)) {
            this.#handlers.set(name, new Map);
        }
        signal?.addEventListener('abort', () => this.off(name, handler));
        // @ts-ignore
        this.#handlers.get(name).set(handler, callback);
        return this;
    }
    off(name, handler) {
        if (handler == null) {
            this.#handlers.delete(name);
        }
        else if (this.#handlers.has(name)) {
            // @ts-ignore
            this.#handlers.get(name).delete(handler);
            // @ts-ignore
            if (this.#handlers.get(name).size === 0) {
                this.#handlers.delete(name);
            }
        }
        return this;
    }
    trigger(name, ...args) {
        if (this.#handlers.has(name)) {
            // @ts-ignore
            for (const handler of this.#handlers.get(name).values()) {
                handler(...args);
            }
        }
    }
    definePseudo(pseudo, parser) {
        this.#pseudo.set(pseudo, parser);
    }
    getListeners(...args) {
        if (args.length == 0 || args.length > 1) {
            return [...(args.length > 1 ? args : this.#handlers.keys())].reduce((acc, curr) => {
                if (this.#handlers.has(curr)) {
                    // @ts-ignore
                    acc[curr] = [...this.#handlers.get(curr).keys()];
                }
                return acc;
            }, Object.create(null));
        }
        if (this.#handlers.has(args[0])) {
            // @ts-ignore
            return [...this.#handlers.get(args[0]).keys()];
        }
        return [];
    }
}

export { Observer };
