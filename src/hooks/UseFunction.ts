import { useRef, useCallback } from 'react';

// eslint-disable-next-line no-unused-vars
type noop = (this: any, ...args: any[]) => any;

// eslint-disable-next-line no-unused-vars
type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;

/**
 * @description a hook to use memoised function
 * @param method function should be cached
 * @returns function used
 */
export function useFunction<Func extends noop>(method: Func): Func {
    const memoisedMethod = useCallback(method, [method]);
    const methodRef = useRef(memoisedMethod);
    methodRef.current = memoisedMethod;

    const realFunction = useRef<PickFunction<Func> | null>(null);
    if (!realFunction.current) {
        realFunction.current = function (this, ...args) {
            return methodRef.current.apply(this, args);
        };
    }

    return realFunction.current as Func;
}
