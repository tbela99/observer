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
export function debounce(name: string, handler: Function, params: string) {

    let duration: number = +params;

    if (!Number.isInteger(duration)) {

        throw new Error(`Invalid argument :debounce(int). expecting number, found ${params}`);
    }

    if (duration < 0) {

        throw new Error(`Invalid argument :debounce(arg). counter must be greater or equal to 0, found ${params}`);
    }

    // @ts-ignore
    let timer: number | null = null;

    return (...args: any) => {

        if (timer != null) {

            clearTimeout(timer);
        }

        timer = setTimeout(() => handler(...args), duration);
    }
}