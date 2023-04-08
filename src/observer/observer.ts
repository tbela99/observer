import * as pseudos from './pseudo';
import {PseudoHandler} from "../@types";

import {expect} from '@esm-bundle/chai';

export class Observer {

    #handlers: Map<string, Map<Function, Function>> = new Map<string, Map<Function, Function>>;
    #pseudo: Map<string, PseudoHandler> = new Map<string, PseudoHandler>;

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

    off(name: string, handler?: Function): this {

        if (handler == null) {

            this.#handlers.delete(name);
        } else if (this.#handlers.has(name)) {

            // @ts-ignore
            this.#handlers.get(name).delete(handler);

            // @ts-ignore
            if (this.#handlers.get(name).size === 0) {

                this.#handlers.delete(name);
            }
        }

        return this;
    }

    trigger(name: string, ...args: any) {

        if (this.#handlers.has(name)) {

            // @ts-ignore
            for (const handler of this.#handlers.get(name).values()) {

                handler(...args);
            }
        }
    }

    definePseudo(pseudo: string, parser: PseudoHandler) {

        this.#pseudo.set(pseudo, parser);
    }

    getListeners(...args: string[]): Function[] | { [key: string]: Function[] } {

        if (args.length == 0 || args.length > 1) {

            return [...(args.length > 1 ? args : this.#handlers.keys())].reduce((acc: {
                [key: string]: Function[]
            }, curr: string) => {

                if (this.#handlers.has(curr)) {

                    // @ts-ignore
                    acc[curr] = [...this.#handlers.get(curr).keys()];
                }

                return acc
            }, Object.create(null));
        }

        if (this.#handlers.has(args[0])) {

            // @ts-ignore
            return [...this.#handlers.get(args[0]).keys()];
        }

        return [];
    }
}