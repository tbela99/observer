import {expect} from '@esm-bundle/chai';
// import {expect} from 'mocha';

import {Observer} from "../src";
// import {before} from "mocha";

const observer: Observer = new Observer();
const controller: AbortController = new AbortController();

let times = 0;

let listeners: Function[] | { [key: string]: Function[]; };

function log(message: string) {
    
}

observer.on('click', () => log('> clicked'));
observer.on('click:once', () => log('> click once - 1 time'));
observer.on('click', () => log('> click event listener will be removed using abort controller'), controller.signal);
observer.on('click:throttle(250)', () => log('> click throttled'));
observer.on('click:debounce(250)', () => log('> click debounced'));
observer.on('click:times(2)', () => log(`> clicked ${++times} times - 2 at most`));

listeners = observer.getListeners();

describe('test observer', function () {

    it('check has listeners', function () {

        expect(observer.hasListeners()).equals(true);
        expect(observer.hasListeners(('click'))).equals(true);
        expect(observer.hasListeners('foo')).equals(false)

    });

    it('check listeners', function () {

        expect(Object.getPrototypeOf(listeners)).equals(null);
        expect(Object.keys(listeners)).deep.equals(['click']);
        // @ts-ignore
        expect(listeners.click.length).equals(6);

        observer.trigger('click');
        return new Promise(resolve => setTimeout(resolve, 125));
    });

        it('check once removed', function () {

            listeners = observer.getListeners();

            // @ts-ignore
            expect(listeners.click.length).equals(5);
        });

    it('check abort controller event removed', function () {

        controller.abort();
        listeners = observer.getListeners();

        // @ts-ignore
        expect(listeners.click.length).equals(4);
        return new Promise(resolve => setTimeout(resolve, 125));
    });

    it('check times event removed', function () {

        observer.trigger('click');
        listeners = observer.getListeners();

        // @ts-ignore
        expect(listeners.click.length).equals(3);
    });

    it('add new event listener', function () {

        observer.on('move:once', () => log('are you moving?'));
        listeners = observer.getListeners();


        expect(observer.hasListeners('move')).equals(true);
        expect(Object.keys(listeners)).deep.equals(['click', 'move']);

        observer.trigger('move', 'nowhere');

        listeners = observer.getListeners();
        expect(observer.hasListeners(('move'))).equals(false);
        expect(Object.keys(listeners)).deep.equals(['click']);
    });
});

