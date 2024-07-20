import { useRef, useState } from 'react';

/** @description a hook for using `Set` */
export function useSet<T>(val: Set<T> | T[] = []) {
    const initValue = useRef(new Set(val));

    const [s, setS] = useState(initValue.current);

    const methods = {
        add(v: T) {
            setS(oldValue => {
                const newSet = new Set(oldValue);
                newSet.add(v);
                return newSet;
            });
        },
        batchAction(actionType: 'add' | 'delete', ...args: T[]) {
            setS(oldValue => {
                const oldValueList = Array.from(oldValue);

                if (actionType === 'add') {
                    return new Set([...oldValueList, ...args]);
                }

                return new Set(oldValueList.filter(v => !args.includes(v)));
            });
        },
        clear() {
            setS(new Set<T>());
        },
        cover(sv: Set<T> | T[] = initValue.current) {
            setS(new Set(sv));
        },
        delete(v: T) {
            setS(oldValue => {
                const newSet = new Set(oldValue);
                if (oldValue.has(v)) {
                    newSet.delete(v);
                }
                return newSet;
            });
        },
        reset() {
            setS(initValue.current);
        },
        toArray() {
            return Array.from(s);
        },
        toggle(v: T) {
            setS(oldValue => {
                const newSet = new Set(oldValue);
                if (oldValue.has(v)) {
                    newSet.delete(v);
                } else {
                    newSet.add(v);
                }
                return newSet;
            });
        },
    };

    return [s, methods] as const;
}
