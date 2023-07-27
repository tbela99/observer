type PseudoHandler = (name: string, handler: Function, params?: string) => Function;

declare class Observer {
    #private;
    constructor();
    on(name: string, handler: Function, signal?: AbortSignal): this;
    off(name: string, handler?: Function): this;
    trigger(name: string, ...args: any): void;
    triggerAsync(name: string, ...args: any[]): Promise<any[]>;
    definePseudo(pseudo: string, parser: PseudoHandler): void;
    hasListeners(name?: string): boolean;
    getListeners(...args: string[]): Function[] | {
        [key: string]: Function[];
    };
}

export { Observer };
