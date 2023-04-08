import {Observer} from "../observer";

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
export function times(name: string, handler: Function, params: string, observer: Observer) {

    let counter: number = +params - 1;

    if (!Number.isInteger(counter)) {

        throw new Error(`Invalid argument :times(int). expecting number, found ${params}`);
    }

    if (counter < 0) {

        throw new Error(`Invalid argument :times(arg). counter must be greater than 0, found ${params}`);
    }

    return (...args: any) => {

        if (counter-- === 0) {

            observer.off(name, handler);
        }

        handler(...args);
    }
}