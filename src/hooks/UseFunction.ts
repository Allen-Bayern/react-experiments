import { useRef, useCallback } from 'react';

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
