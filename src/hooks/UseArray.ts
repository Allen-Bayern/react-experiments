import { useRef, useState, useCallback, useMemo } from 'react';
import deepClone from 'clone';
import deepFreeze from 'deep-freeze-strict';
import { getRandomInt } from '@/utils';

/** 代理一些常用的数组方法 */
export const useArray = <T = unknown>(initVal: Iterable<T> = []) => {
    const arr = useRef([...initVal]);
    const [random, setRandom] = useState(() => getRandomInt());

    const updateRandom = useCallback(() => {
        setRandom(oldValue => {
            const tmp = getRandomInt();
            if (oldValue === tmp) {
                return oldValue + 1;
            }

            return tmp;
        });
    }, []);

    const arrDict = useMemo(() => {
        type ForEachMethod = Parameters<typeof arr.current.forEach>[0];

        const pushWithoutUpdate = (...values: T[]) => arr.current.push(...values);
        const popWithoutUpdate = () => arr.current.pop();
        const shiftWithoutUpdate = () => arr.current.shift();

        return {
            elemAt(i: number) {
                if (i < 0 && i >= arr.current.length) {
                    return null;
                }

                return arr.current[i];
            },
            forEach(cb: ForEachMethod) {
                arr.current.forEach(cb);
            },
            shift() {
                const shiftValue = shiftWithoutUpdate();
                updateRandom();
                return shiftValue;
            },
            shiftWithoutUpdate,
            push(...values: T[]) {
                const pushVal = pushWithoutUpdate(...values);
                updateRandom();
                return pushVal;
            },
            pushWithoutUpdate,
            pop() {
                const popVal = popWithoutUpdate();
                updateRandom();
                return popVal;
            },
            popWithoutUpdate,
            get length() {
                return arr.current.length;
            },
            /** __NOTE__: It is read-only!!! */
            get value() {
                return deepFreeze(deepClone(arr.current)) as Readonly<T[]>;
            },
        };
    }, [random]);

    return arrDict;
};
