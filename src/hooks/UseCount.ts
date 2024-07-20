import { useState, useCallback } from 'react';

type UseCountOpts = Partial<{
    start: number | (() => number);
    step: number;
}>;

export function useCount(opts: UseCountOpts = {}) {
    const { start = 0, step = 1 } = opts;

    if (!step) {
        throw new Error('The step must not be 0 or NaN');
    }

    const [num, setNum] = useState(start);

    const countMethod = useCallback(() => {
        setNum(oldNum => oldNum + step);
    }, [step]);

    return [num, countMethod] as const;
}
