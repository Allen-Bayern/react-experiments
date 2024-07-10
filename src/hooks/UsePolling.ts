import { useRef, useEffect, useState } from 'react';

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
    const funcRef = useRef(f);

    function startPolling() {
        setIsStarted(true);
    }

    function stopPolling() {
        if (timer.current) {
            clearTimeout(timer.current);
            timer.current = null;
        }
    }

    useEffect(() => {
        funcRef.current = f;
    }, [f]);

    useEffect(
        function pollingFunc() {
            if (isStarted) {
                timer.current = setTimeout(() => {
                    funcRef.current();
                    pollingFunc();
                }, inter);
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
