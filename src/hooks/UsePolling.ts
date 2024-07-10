import { useRef, useEffect, useState, useCallback } from 'react';

/** 轮询 hook */
export function usePolling(
    f: () => void,
    opts: Partial<{
        inter: number;
        isStartAtOnce: boolean;
    }> = {}
) {
    const { inter = 1000, isStartAtOnce = false } = opts;

    const [isStarted, setIsStarted] = useState(isStartAtOnce);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // to get the latest method
    const savedFunc = useCallback(f, [f]);
    const funcRef = useRef(savedFunc);
    funcRef.current = savedFunc;

    function startPolling() {
        setIsStarted(true);
    }

    function stopPolling() {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
            setIsStarted(false);
        }
    }

    useEffect(
        function pollingFunc() {
            if (isStarted) {
                timer.current = setTimeout(() => {
                    funcRef.current();
                    pollingFunc();
                }, inter);
            } else {
                stopPolling();
            }

            return stopPolling;
        },
        [isStarted]
    );

    return {
        startPolling,
        stopPolling,
    };
}
