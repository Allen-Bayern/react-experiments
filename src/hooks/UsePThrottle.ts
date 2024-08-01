import { useRef, useEffect, useCallback } from 'react';
import pThrottle, { type Options as PThrottleOptions } from 'p-throttle';

// eslint-disable-next-line @typescript-eslint/no-empty-function
function pass() {}

export function useThrottleWrapper(opts: Partial<PThrottleOptions> = {}) {
    const { limit = 1, interval = 1000, strict = true, onDelay = pass } = opts;

    const onDelayMethod = useRef(onDelay);
    useEffect(() => {
        onDelayMethod.current = onDelay;
    }, [onDelay]);

    return useCallback(
        pThrottle({
            limit,
            interval,
            strict,
            onDelay() {
                onDelayMethod.current();
            },
        }),
        [limit, interval, strict]
    );
}

export function useThrottledFunction<F extends BaseFunc>(func: F, opts: Partial<PThrottleOptions> = {}) {
    const { limit = 1, interval = 1000, strict = true, onDelay = pass } = opts;

    const realMethod = useRef(func);
    useEffect(() => {
        realMethod.current = func;
    }, [func]);

    const onDelayMethod = useRef(onDelay);
    useEffect(() => {
        onDelayMethod.current = onDelay;
    }, [onDelay]);

    const throttle = useThrottleWrapper({ limit, interval, strict, onDelay: onDelayMethod.current });

    return useCallback(throttle(realMethod.current), [limit, interval, strict]);
}
