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
        batch(actionType: 'add' | 'delete', ...args: T[]) {
            setS(oldValue => {
                const valueList = [...Array.from(oldValue), ...args];

                if (actionType === 'add') {
                    return new Set(valueList);
                }

                const newList: T[] = [];
                valueList
                    .reduce((map, v) => {
                        if (map.has(v)) {
                            const count = map.get(v) as number;
                            map.set(v, 1 + count);
                        } else {
                            map.set(v, 1);
                        }

                        return map;
                    }, new Map<T, number>())
                    .forEach((count, v) => {
                        if (count === 1) {
                            newList.push(v);
                        }
                    });

                return new Set(newList);
            });
        },
        clear() {
            setS(new Set<T>());
        },
        cover(sv = initValue.current) {
            setS(sv);
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
