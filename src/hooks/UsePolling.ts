import { useRef, useEffect, useState, useCallback } from 'react';

/** 轮询 hook */
export function usePolling(
    fn: () => void | Promise<void>,
    opts: Partial<{
        /** 间隔 */
        inter: number;
        /** 是否马上开始 */
        immediate: boolean;
    }> = {}
) {
    const { inter = 1000, immediate = false } = opts;

    const [isStarted, setIsStarted] = useState(immediate);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // cache latest function
    const fnRef = useRef(fn);

    const clearTimer = useCallback(() => {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }, []);

    const startPolling = useCallback(() => {
        setIsStarted(true);
    }, []);

    const stopPolling = useCallback(() => {
        setIsStarted(false);
    }, []);

    useEffect(() => {
        fnRef.current = fn;
    }, [fn]);

    useEffect(
        function pollingFunc() {
            clearTimer();

            if (isStarted) {
                timer.current = setTimeout(async () => {
                    await fnRef.current();
                    pollingFunc();
                }, inter);
            }

            return clearTimer;
        },
        [isStarted]
    );

    return [startPolling, stopPolling] as const;
}
