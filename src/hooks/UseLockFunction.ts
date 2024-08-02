import { useRef, useCallback } from 'react';

/**
 * A custom hook that prevents multiple concurrent invocations of a function.
 * @param {((...params: P) => Promise<R>) | ((...params: P) => R)} requestFunc - The function to be wrapped.
 * @returns {(...params: P) => Promise<R>} - The wrapped function.
 */
export const useLockFunction = <P extends unknown[] = unknown[], R extends unknown = unknown>(
    requestFunc: ((...params: P) => Promise<R>) | ((...params: P) => R)
) => {
    const isCanTrigger = useRef(true);

    return useCallback(
        async (...params: P) => {
            if (!isCanTrigger.current) {
                return;
            }

            isCanTrigger.current = false;

            try {
                const res = await requestFunc(...params);
                return res;
            } finally {
                isCanTrigger.current = true;
            }
        },
        [requestFunc]
    );
};
