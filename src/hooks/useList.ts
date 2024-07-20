import { useState, useRef } from 'react';
import deepFreeze from 'deep-freeze-strict';
import clone from 'clone';

export function useList<List extends unknown[] = unknown[]>(list: List | null = null) {
    const initValue = useRef(Array.isArray(list) ? list : ([] as unknown[] as List));

    const [arr, setArr] = useState(deepFreeze(initValue.current));

    const append = (v: List[number]) => {
        setArr(oldArray => deepFreeze([...oldArray, v] as List));
    };

    const extend = (l: List) => {
        setArr(oldArray => deepFreeze([...oldArray, ...l] as List));
    };

    const methods = {
        append,
        concat: extend,
        clear() {
            setArr([] as unknown[] as List);
        },
        deleteAsIndex(i: number) {
            if (i < -arr.length || i > arr.length) {
                throw new Error(
                    'The first parameter i MUST not be more than the length of the array or be less than the (0 - array.length)'
                );
            }

            if (!arr.length) {
                console.warn('The list is empty. Nothing is deleted');
                return null;
            }

            // calculate real index
            let realIndex = i;
            if (i < 0) {
                realIndex = arr.length + i;
            }

            if (realIndex === arr.length - 1) {
                setArr(oldArray => [...oldArray].slice(0, -1) as List);
            } else if (!realIndex) {
                setArr(oldArray => [...oldArray].slice(1) as List);
                return;
            } else {
                setArr(oldArray =>
                    deepFreeze([...oldArray.slice(0, realIndex), ...oldArray.slice(realIndex + 1)] as List)
                );
            }

            return arr[realIndex] as List[number];
        },
        extend,
        insert(v: List[number], i = 0) {
            if (i < -arr.length || i > arr.length) {
                throw new Error(
                    'The first parameter i MUST not be more than the length of the array or be less than the (0 - array.length)'
                );
            }

            // calculate real index
            let realIndex = i;
            if (i < 0) {
                realIndex = arr.length + i;
            }

            if (realIndex === arr.length) {
                append(v);
                return;
            }

            if (!realIndex) {
                setArr(oldArray => deepFreeze([v, ...oldArray] as List));
                return;
            }

            setArr(oldArray => deepFreeze([...oldArray.slice(0, realIndex), v, ...oldArray.slice(realIndex)] as List));
            return;
        },
        push: append,
        pop() {
            let poppedElement: List[number] | null = null;

            if (arr.length) {
                poppedElement = arr[arr.length - 1] as List[number];
                setArr(oldArray => deepFreeze([...oldArray].slice(0, -1) as List));
            } else {
                console.warn('The list is empty. Nothing is popped');
            }

            return poppedElement;
        },
        reset() {
            setArr(deepFreeze([...initValue.current] as List));
        },
        reverse() {
            setArr(oldArray => deepFreeze([...oldArray].reverse() as List));
        },
        shift() {
            let shiftedElement: List[number] | null = null;

            if (arr.length) {
                shiftedElement = arr[0];
                setArr(oldArray => deepFreeze([...oldArray].slice(1) as List));
            } else {
                console.warn('The list is empty. Nothing is popped');
            }

            return shiftedElement;
        },
        // eslint-disable-next-line no-unused-vars
        sort(sortCb?: (a: List[number], b: List[number]) => number) {
            setArr(oldArray => deepFreeze([...oldArray].sort(sortCb) as List));
        },
        /** 返回一个深拷贝版本的当前数组 */
        toCopied() {
            return clone(arr);
        },
        // eslint-disable-next-line no-unused-vars
        toSorted(sortCb?: (a: List[number], b: List[number]) => number) {
            setArr(oldArray => deepFreeze([...oldArray].sort(sortCb) as List));
            return clone(arr).sort(sortCb);
        },
        unshift(v: List[number]) {
            setArr(oldArray => deepFreeze([v, ...oldArray] as List));
        },
    };

    return [arr, methods] as const;
}
