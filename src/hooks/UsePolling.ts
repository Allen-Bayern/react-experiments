import { useRef, useEffect, useState } from 'react';

/** 轮询 hook */
export function usePolling(
    f: () => void | Promise<void>,
    opts: Partial<{
        /** 间隔 */
        inter: number;
        /** 是否马上开始 */
        isStartAtOnce: boolean;
    }> = {}
) {
    const { inter = 1000, isStartAtOnce = false } = opts;

    const [isStarted, setIsStarted] = useState(isStartAtOnce);
    const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // to get the latest method
    const funcRef = useRef(f);
    useEffect(() => {
        funcRef.current = f;
    }, [f]);

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
                    if (timer.current) {
                        clearTimeout(timer.current);
                    }
                    pollingFunc();
                }, inter);
            }

            return stopPolling;
        },
        [isStarted]
    );

    return [startPolling, stopPolling] as const;
}
