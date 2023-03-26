import {Observer} from "../src";

const observer = new Observer();
const controller = new AbortController();

let times = 0;

observer.on('click', () => console.log('> clicked'));
observer.on('click:once', () => console.log('> click once - 1 time'));
observer.on('click', () => console.log('> click event listener will be removed using abort controller'), controller.signal);
observer.on('click:throttle(250)', () => console.log('> click throttled'));
observer.on('click:debounce(250)', () => console.log('> click debounced'));
observer.on('click:times(2)', () => console.log(`> clicked ${++times} times - 2 at most`));

observer.trigger('click');
console.log('waiting 125ms ...');
await new Promise(resolve => setTimeout(resolve, 125));
observer.trigger('click');
console.log('waiting 125ms ...');
await new Promise(resolve => setTimeout(resolve, 125));
controller.abort('no reason valid was given')
observer.trigger('click');
console.log('waiting 125ms ...');
await new Promise(resolve => setTimeout(resolve, 125));
observer.trigger('click');