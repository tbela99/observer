# Event Observer

Manage custom events

# Usage

## NodeJS

```Javascript

import {Observer} from '@tbela99/observer';

const observer = new Observer();

// register change listener
observer.on('change', (...args) => console.log(...args));

// trigger change event
observer.trigger('change', 'a', 'b', 'c');

```

## Web

```html

<script src="./dist/index.js"></script>
<script>

    const observer = new Observer();

    // register change listener
    observer.on('change', (...args) => console.log(...args));

    // trigger change event
    observer.trigger('change', 'a', 'b', 'c');
</script>
```

## Using AbortController

AbortController can be used to unregister and event handler

```javascript

const controller = new AbortController();

observer.on('change', (...args) => console.log('something has changed', ...args), controller.signal);

observer.trigger('change', 'I have changed');

// remove event listener
controller.abort();

// the event handler is unregistered
observer.trigger('change', 'I have also changed');
```

## Utilities

Observer provides some built-in event utilities.

### Once

execute an event handler once, then remove it

```javascript

// register change listener
observer.on('change:once', (...args) => console.log(...args));

// event handler is executed, then removed
observer.trigger('change', 'a', 'b', 'c');

// nothing happen
observer.trigger('change', 'a', 'b', 'c');

```

### Times

execute an event handler a certain number of time, after which it is removed

```javascript

// register change listener
observer.on('change:time(2)', (...args) => console.log(...args));

// event handler is executed, then removed
observer.trigger('change', 'a', 'b', 'c');
// event handler is executed, then removed
observer.trigger('change', 'a', 'b', 'c');

// nothing happens
observer.trigger('change', 'a', 'b', 'c');
```

### Throttle

creates a throttled handler

```javascript

// register change listener. It is executed only once in a period of 250ms
observer.on('change:throttle(250)', (...args) => console.log(...args));

// event handler is executed, then removed
observer.trigger('change', 'a', 'b', 'c');

// ignored
observer.trigger('change', 'a', 'b', 'c');
```
### Debounce

creates a debounced handler

```javascript

    // register change listener. It is executed only once in a period of 250ms
    observer.on('change:throttle(250)', (...args) => console.log(...args));

    // event handler is executed, then removed
    observer.trigger('change', 'a', 'b', 'c');
    
    // ignored
    observer.trigger('change', 'a', 'b', 'c');
```