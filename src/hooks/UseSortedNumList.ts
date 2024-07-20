import { useState, useEffect } from 'react';
import { useList } from './UseList';

/** 自动保持有序数组hook */
export function useSortedNumList(list: number[] = [], sortMethod = (a: number, b: number) => a - b) {
    const [
        numList,
        {
            append,
            clear,
            concat,
            count,
            cover,
            deleteAsValue,
            extend,
            filter,
            push,
            pop,
            reset,
            shift,
            unique,
            unshift,
        },
    ] = useList(list);

    const [newNumList, setNewNumList] = useState<typeof list>([]);
    const [isReversed, setIsReversed] = useState(false);

    useEffect(() => {
        let sortedNumList = [...numList].sort(sortMethod);

        if (isReversed) {
            sortedNumList = [...numList].sort(sortMethod).reverse();
        }

        setNewNumList(sortedNumList);
    }, [numList, isReversed]);

    return [
        newNumList,
        {
            append,
            clear,
            concat,
            count,
            cover,
            deleteAsIndex(i: number) {
                if (i < -newNumList.length || i > newNumList.length) {
                    throw new Error(
                        'The first parameter i MUST not be more than the length of the array or be less than the (0 - array.length)'
                    );
                }

                if (!newNumList.length) {
                    console.warn('The list is empty. Nothing is deleted');
                    return null;
                }

                // calculate real index
                let realIndex = i;
                if (i < 0) {
                    realIndex = newNumList.length + i;
                }

                const valueToBeDeleted = newNumList[realIndex];
                deleteAsValue(valueToBeDeleted, false);

                return valueToBeDeleted;
            },
            deleteAsValue,
            extend,
            filter,
            push,
            pop,
            reset,
            reverse() {
                setIsReversed(oldValue => !oldValue);
            },
            shift,
            // 复写toCopied
            toCopied: () => [...numList],
            unique,
            unshift,
        },
    ] as const;
}
