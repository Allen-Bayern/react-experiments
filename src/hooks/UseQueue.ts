import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import deepFreeze from 'deep-freeze-strict';
import deepClone from 'clone';

interface QueueNode<T> {
    nextNode: QueueNode<T> | null;
    get value(): T;
}

type MaybeQueueNode<T> = QueueNode<T> | null;

/** to create a queue node */
const createQueueNode = <T>(v: T): QueueNode<T> => {
    return {
        nextNode: null,
        get value() {
            return v;
        },
    };
};

/** A hook using queue structure like `yocto-queue` */
export const useQueue = <T = unknown>(initValueAsArray: T[] = []) => {
    // eslint-disable-next-line no-unused-vars
    type IterMethod<R = void> = (value: T, index: number, node: QueueNode<T>) => R;

    const [sizeOfQueue, setSizeOfQueue] = useState(() => initValueAsArray.length);
    const queueSize = useRef(0);

    const headNode = useRef<MaybeQueueNode<T>>(null);
    const tailNode = useRef<MaybeQueueNode<T>>(null);

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

    // The `methods` should not be re-created.
    const methods = useMemo(
        () => ({
            clear() {
                clearWithoutRender();
                setSizeOfQueue(() => 0);
            },
            enqueue(value: T) {
                enqueueWithoutRender(value);
                setSizeOfQueue(queueSize.current);
            },
            enqueueWithoutRender,
            dequeue() {
                const dequeued = dequeueWithoutRender();
                setSizeOfQueue(queueSize.current);
                return dequeued;
            },
            dequeueWithoutRender,
            forEach,
            /**
             * Get a read-only deep copy of the queue object.
             *
             * Use this method carefully
             * because with the expand of the queue,
             * the action of copy will cost.
             */
            getCopyOfQueue() {
                if (!headNode.current) {
                    return null;
                }

                const deepCopied = deepClone(headNode.current);
                return deepFreeze(deepCopied) as Readonly<typeof deepCopied>;
            },
            map,
            toArray: () => map(item => item),
        }),
        []
    );

    // --- initial logics ---
    useEffect(() => {
        clearWithoutRender();

        if (initValueAsArray.length) {
            initValueAsArray.forEach(item => {
                enqueueWithoutRender(item);
            });
        }
    }, []);

    return [sizeOfQueue, methods] as const;
};
