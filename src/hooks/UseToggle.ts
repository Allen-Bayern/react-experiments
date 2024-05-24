import { useState, useCallback, useMemo } from 'react';

export function useToggle(init = false) {
    const [v, setV] = useState(init);

    const toggle = useCallback(() => {
        setV(o => !o);
    }, []);

    return [v, toggle, setV] as const;
}

export const useBool = useToggle;

export function use01(init: 0 | 1 = 0) {
    const [v, toggle, setV] = useBool(Boolean(init));
    const numV = useMemo(() => Number(v) as typeof init, [v]);
    const setter = useCallback((newV: 0 | 1) => {
        setV(Boolean(newV));
    }, []);

    return [numV, toggle, setter] as const;
}
