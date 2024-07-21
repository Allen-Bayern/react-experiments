import { useRef, useEffect } from 'react';
import type { BaseFunc } from './share';

export function useTimeoutFn<F extends BaseFunc>(fn: F, ms = 1000) {
    const readyStatus = useRef(false);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    function clearFunc() {
        readyStatus.current = false;
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }

    function startTimer() {
        clearFunc();

        timer.current = setTimeout(() => {
            readyStatus.current = true;
            fn();
        }, ms);

        return clearFunc;
    }

    function getIsReady() {
        return readyStatus.current;
    }

    useEffect(startTimer, [ms]);

    return [getIsReady, clearFunc, startTimer] as const;
}
