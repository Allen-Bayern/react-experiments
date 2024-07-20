import { useState } from 'react';

type UseCountOpts = Partial<{
    start: number | (() => number);
    step: number;
}>;

/** 计数器 */
export function useCount(opts: UseCountOpts = {}) {
    const { start = 0, step = 1 } = opts;

    if (!step) {
        throw new Error('The step must not be 0 or NaN');
    }

    const getNum = () => {
        let res = 0;
        if (typeof start === 'function') {
            res = start();
        } else {
            res = start;
        }

        return Number.isNaN(res) ? 0 : res;
    };

    const [num, setNum] = useState(getNum);

    const countMethod = () => {
        setNum(oldNum => oldNum + step);
    };

    return [num, countMethod] as const;
}
