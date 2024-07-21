import { useEffect, type DependencyList } from 'react';
import { useTimeoutFn } from './UseTimeoutFn';
import type { BaseFunc } from './share';

export function useDebounce<F extends BaseFunc>(fn: F, ms = 1000, deps: DependencyList = []) {
    const [getIsReady, cancel, resume] = useTimeoutFn(fn, ms);

    useEffect(resume, deps);
    return [getIsReady, cancel] as const;
}
