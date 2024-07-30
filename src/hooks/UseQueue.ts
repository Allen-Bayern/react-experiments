import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { getRandomInt } from '@/utils';
import deepFreeze from 'deep-freeze-strict';
import deepClone from 'clone';

type MaybeQueueNode<T> = LinkedNode<T> | null;

/** to create a queue node */
const createQueueNode = <T>(value: T): LinkedNode<T> => {
    return {
        nextNode: null,
        value,
    };
};

/** A hook using queue structure like `yocto-queue` */
export const useQueue = <T = unknown>(initValueAsArray: T[] = []) => {
    // eslint-disable-next-line no-unused-vars
    type IterMethod<R = void> = (value: T, index: number, node: LinkedNode<T>) => R;

    const [randomInt, setRandomInt] = useState(getRandomInt());

    const randomIntChange = useRef(() => {
        setRandomInt(oldValue => {
            const tmp = getRandomInt();
            return tmp === oldValue ? oldValue + 1 : tmp;
        });
    });

    const headNode = useRef<MaybeQueueNode<T>>(null);
    const tailNode = useRef<MaybeQueueNode<T>>(null);
    const queueSize = useRef(0);

    const clearWithoutRender = useCallback(() => {
        headNode.current = null;
        tailNode.current = null;
        queueSize.current = 0;
    }, []);

    const dequeueWithoutRender = useCallback(() => {
        if (!headNode.current) {
            return null;
        }

        const { nextNode } = headNode.current;
        headNode.current = nextNode;

        if (queueSize.current > 0) {
            queueSize.current--;
        } else {
            queueSize.current = 0;
        }

        return nextNode?.value ?? null;
    }, []);

    const enqueueWithoutRender = useCallback((v: T) => {
        const node = createQueueNode(v);

        if (!headNode.current) {
            headNode.current = node;
        } else if (tailNode.current) {
            tailNode.current.nextNode = node;
        }
        tailNode.current = node;

        queueSize.current++;
    }, []);

    const forEach = useCallback((iterMethod: IterMethod) => {
        if (!headNode.current) {
            return;
        }

        let currentIndex = 0;
        let curNode: MaybeQueueNode<T> = headNode.current;

        while (curNode) {
            iterMethod(curNode.value, currentIndex++, curNode);
            ({ nextNode: curNode } = curNode);
        }
    }, []);

    const map = useCallback(<Return = unknown>(mapMethod: IterMethod<Return>): Return[] => {
        const res: Return[] = [];

        forEach((value, index, curNode) => {
            res.push(mapMethod(value, index, curNode));
        });

        return res;
    }, []);

    // --- Initialise ---
    useEffect(() => {
        clearWithoutRender();

        if (initValueAsArray.length) {
            initValueAsArray.forEach(item => {
                enqueueWithoutRender(item);
            });
        }
    }, []);

    const queue = useMemo(
        () => ({
            batchEnqueue(...values: T[]) {
                values.forEach(value => {
                    enqueueWithoutRender(value);
                });

                randomIntChange.current();
            },
            batchEnqueueWithoutRender(...values: T[]) {
                values.forEach(value => {
                    enqueueWithoutRender(value);
                });
            },
            clear() {
                clearWithoutRender();
                randomIntChange.current();
            },
            enqueue(value: T) {
                enqueueWithoutRender(value);
                randomIntChange.current();
            },
            enqueueWithoutRender,
            dequeue() {
                const dequeued = dequeueWithoutRender();
                randomIntChange.current();
                return dequeued;
            },
            dequeueWithoutRender,
            forEach,
            /**
             * This method is used to obtain a read-only deep copy of the current queue.
             *
             * __Note__:
             * Use this method with caution,
             * since deep copying can lead to performance issues
             * as the queue elements increase.
             */
            getReadonlyCopyOfQueue() {
                if (!headNode.current) {
                    return null;
                }

                const deepCopied = deepClone(headNode.current);
                return deepFreeze(deepCopied) as Readonly<typeof deepCopied>;
            },
            map,
            toArray: () => map(item => item),
            /**
             * Updates the view.
             * If you modify elements in the queue using `enqueueWithoutRender` or `dequeueWithoutRender`,
             * and you need to update the view,
             * you can manually invoke this method to trigger re-rendering.
             */
            updateView: randomIntChange.current,
            get size() {
                return queueSize.current;
            },
            *[Symbol.iterator]() {
                let { current: curNode } = headNode;

                while (curNode) {
                    yield curNode.value;
                    ({ nextNode: curNode } = curNode);
                }
            },
        }),
        [randomInt]
    );

    return queue;
};
