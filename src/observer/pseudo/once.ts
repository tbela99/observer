import {Observer} from "../observer";

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
export function once(name: string, handler: Function, params: string, observer: Observer) {

    return function (...args: any) {

        handler(...args);
        observer.off(name, handler);
    }
}