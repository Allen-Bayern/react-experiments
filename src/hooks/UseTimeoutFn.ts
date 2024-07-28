import { useRef, useEffect } from 'react';

export function useTimeoutFn(fn: () => void, ms = 1000) {
    const fnRef = useRef(fn);
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
            fnRef.current();
        }, ms);
    }

    function getIsReady() {
        return readyStatus.current;
    }

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    // Main logics
    useEffect(() => {
        startTimer();
        return clearFunc;
    }, [ms]);

    return [getIsReady, clearFunc, startTimer] as const;
}
