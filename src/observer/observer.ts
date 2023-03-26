import * as pseudos from './pseudo';
import {PseudoHandler} from "../@types";

export class Observer {

    #handlers = new Map;
    #pseudo = new Map;

    constructor() {

        for (const entry of Object.entries(pseudos)) {

            // @ts-ignore
            this.definePseudo(entry[0], entry[1]);
        }
    }

    on(name: string, handler: Function, signal?: AbortSignal): this {

        const match = name.match(/(.*):([^:()]+)(\((.*?)\))?$/);
        let callback = handler;

        if (match != null && this.#pseudo.has(match[2])) {

            name = match[1];
            callback = this.#pseudo.get(match[2])(name, handler, match[4], this);
        }

        if (!this.#handlers.has(name)) {

            this.#handlers.set(name, new Map);
        }

        signal?.addEventListener('abort', () => this.off(name, handler));

        this.#handlers.get(name).set(handler, callback);
        return this;
    }

    off(name: string, handler?: Function): this {

        if (handler == null) {

            this.#handlers.delete(name);
        }

        else if (this.#handlers.has(name)) {

            this.#handlers.get(name).delete(handler);

            if (this.#handlers.get(name).size === 0) {

                this.#handlers.delete(name);
            }
        }

        return this;
    }

    trigger(name: string, ...args: any) {

        if (this.#handlers.has(name)) {

            for (const handler of this.#handlers.get(name).values()) {

                handler(...args);
            }
        }
    }

    definePseudo(pseudo: string, parser: PseudoHandler) {

        this.#pseudo.set(pseudo, parser);
    }
}