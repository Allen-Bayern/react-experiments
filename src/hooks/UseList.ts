import { useRef, useState } from 'react';
import deepFreeze from 'deep-freeze-strict';
import clone from 'clone';
import { getRandomInt } from '@/utils';

/** 数组hook */
export function useList<List extends unknown[] = unknown[]>(list: List | null = null) {
    const initValue = useRef(Array.isArray(list) ? list : ([] as unknown[] as List));
    const [arr, setArr] = useState(deepFreeze(initValue.current) as Readonly<List>);

    const getRealIndex = (
        i: number,
        opts: Partial<{
            upper: number;
            lower: number;
            errorInfo: string;
        }> = {}
    ) => {
        const {
            upper = arr.length - 1,
            lower = -arr.length,
            errorInfo = 'The first parameter i MUST not be more than or equal to the length of the array or be less than the (0 - array.length)',
        } = opts;

        if (i < lower || i > upper) {
            throw new Error(errorInfo);
        }

        if (i < 0) {
            return arr.length + i;
        }

        return i;
    };

    const append = (...v: List): void => {
        setArr(oldArray => deepFreeze([...oldArray, ...v] as List) as Readonly<List>);
    };

    const extend = (l: List): void => {
        setArr(oldArray => deepFreeze([...oldArray, ...l] as List) as Readonly<List>);
    };

    const methods = {
        append,
        concat: extend,
        count(v: List[number]): number {
            if (!arr.includes(v)) {
                return 0;
            }

            return arr.reduce((counter: number, item: List[number]) => {
                if (item === v) {
                    return counter + 1;
                }

                return counter;
            }, 0);
        },
        clear(): void {
            setArr([] as unknown as Readonly<List>);
        },
        cover(l: List): void {
            setArr(deepFreeze(l) as Readonly<List>);
        },
        deleteAsIndex(i: number): List[number] {
            // calculate real index
            const realIndex = getRealIndex(i, {
                upper: arr.length,
                errorInfo:
                    'The first parameter i MUST not be more than the length of the array or be less than the (0 - array.length)',
            });

            if (realIndex === arr.length - 1) {
                setArr(oldArray => [...oldArray].slice(0, -1) as unknown as Readonly<List>);
            } else if (!realIndex) {
                setArr(oldArray => [...oldArray].slice(1) as unknown as Readonly<List>);
            } else {
                setArr(oldArray =>
                    deepFreeze([
                        ...oldArray.slice(0, realIndex),
                        ...oldArray.slice(realIndex + 1),
                    ] as unknown as Readonly<List>)
                );
            }

            return arr[realIndex] as Readonly<List>[number];
        },
        /**
         * 删除列表中的某个元素，默认删除第一次出现的元素。
         * 如配置`all = true`, 则删除所有出现的元素
         */
        deleteAsValue(v: List[number], all = false): void {
            if (arr.indexOf(v) === -1) {
                console.warn('The value does not exists. Nothing is deleted');
                return;
            }

            setArr(oldArray => {
                if (all) {
                    return deepFreeze([...oldArray].filter(item => item !== v)) as unknown as Readonly<List>;
                }

                const index = oldArray.indexOf(v);

                if (!index) {
                    return deepFreeze(oldArray.slice(1)) as unknown as Readonly<List>;
                }

                if (index === oldArray.length - 1) {
                    return deepFreeze(oldArray.slice(0, -1)) as unknown as Readonly<List>;
                }

                return deepFreeze([
                    ...oldArray.slice(0, index),
                    ...oldArray.slice(1 + index),
                ]) as unknown as Readonly<List>;
            });
        },
        extend,
        // eslint-disable-next-line no-unused-vars
        filter(cb: (val: List[number], index: number, array: List) => unknown): void {
            setArr(
                oldArray =>
                    [...oldArray].filter((val: List[number], index, array) =>
                        cb(val, index, array as List)
                    ) as unknown as Readonly<List>
            );
        },
        insert(v: List[number], i = 0): void {
            // calculate real index
            const realIndex = getRealIndex(i, {
                upper: arr.length,
                errorInfo:
                    'The first parameter i MUST not be more than the length of the array or be less than the (0 - array.length)',
            });

            if (realIndex === arr.length) {
                setArr(oldArray => deepFreeze([...oldArray, v] as unknown as Readonly<List>));
                return;
            }

            if (!realIndex) {
                setArr(oldArray => deepFreeze([v, ...oldArray] as unknown as Readonly<List>));
                return;
            }

            setArr(oldArray =>
                deepFreeze([
                    ...oldArray.slice(0, realIndex),
                    v,
                    ...oldArray.slice(realIndex),
                ] as unknown as Readonly<List>)
            );
            return;
        },
        push: append,
        pop(): List[number] | null {
            let poppedElement: List[number] | null = null;

            if (arr.length) {
                poppedElement = arr[arr.length - 1] as Readonly<List>[number];
                setArr(oldArray => deepFreeze([...oldArray].slice(0, -1) as unknown as Readonly<List>));
            } else {
                console.warn('The list is empty. Nothing is popped');
            }

            return poppedElement;
        },
        reset(): void {
            setArr(deepFreeze([...initValue.current] as unknown as Readonly<List>));
        },
        reverse(): void {
            setArr(oldArray => deepFreeze([...oldArray].reverse() as unknown as Readonly<List>));
        },
        shift(): List[number] | null {
            let shiftedElement: List[number] | null = null;

            if (arr.length) {
                shiftedElement = arr[0];
                setArr(oldArray => deepFreeze([...oldArray].slice(1) as unknown as Readonly<List>));
            } else {
                console.warn('The list is empty. Nothing is popped');
            }

            return shiftedElement;
        },
        /** 乱序数组 */
        shuffle(): void {
            const indexArray: number[] = [];
            while (indexArray.length < arr.length) {
                const i = getRandomInt({ to: arr.length });
                if (!indexArray.includes(i)) {
                    indexArray.push(i);
                }
            }

            setArr(oldArray => deepFreeze(indexArray.map(i => oldArray[i])) as unknown as Readonly<List>);
        },
        // eslint-disable-next-line no-unused-vars
        sort(sortCb?: (a: List[number], b: List[number]) => number): void {
            setArr(oldArray => deepFreeze([...oldArray].sort(sortCb) as unknown as Readonly<List>));
        },
        /** 返回一个深拷贝版本的当前数组 */
        toCopied(): List {
            return clone(arr);
        },
        // eslint-disable-next-line no-unused-vars
        toSorted(sortCb?: (a: List[number], b: List[number]) => number): List {
            setArr(oldArray => deepFreeze([...oldArray].sort(sortCb) as unknown as Readonly<List>));
            return (clone(arr) as List).sort(sortCb);
        },
        unique(): void {
            setArr(oldArray => deepFreeze(Array.from(new Set(oldArray)) as unknown as Readonly<List>));
        },
        unshift(v: List[number]): void {
            setArr(oldArray => deepFreeze([v, ...oldArray] as unknown as Readonly<List>));
        },
        updateAsIndex(v: List[number], i = 0): void {
            // calculate real index
            const realIndex = getRealIndex(i);

            if (realIndex === arr.length - 1) {
                setArr(oldArray => deepFreeze([...oldArray.slice(0, -1), v] as unknown as Readonly<List>));
                return;
            }

            if (!realIndex) {
                setArr(oldArray => deepFreeze([v, ...oldArray.slice(1)] as unknown as Readonly<List>));
                return;
            }

            setArr(oldArray =>
                deepFreeze([
                    ...oldArray.slice(0, realIndex),
                    v,
                    ...oldArray.slice(realIndex + 1),
                ] as unknown as Readonly<List>)
            );
            return;
        },
    };

    return [arr, methods] as const;
}
