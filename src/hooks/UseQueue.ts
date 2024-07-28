import { useState, useRef, useMemo, useCallback } from 'react';
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

export const useQueue = <T = unknown>() => {
    // eslint-disable-next-line no-unused-vars
    type IterMethod<R = void> = (value: T, index: number, node: QueueNode<T>) => R;

    const [sizeOfQueue, setSizeOfQueue] = useState(0);

    const headNode = useRef<MaybeQueueNode<T>>(null);
    const tailNode = useRef<MaybeQueueNode<T>>(null);

    // forEach method for the queue
    const forEach = useCallback(
        (iterMethod: IterMethod) => {
            if (!headNode.current && !sizeOfQueue) {
                return;
            }

            let currentIndex = 0;
            let { current: curNode } = headNode;
            while (curNode) {
                iterMethod(curNode.value, currentIndex++, curNode);
                ({ nextNode: curNode } = curNode);
            }
        },
        [sizeOfQueue]
    );

    const methods = useMemo(() => {
        return {
            clear() {
                headNode.current = null;
                tailNode.current = null;
                setSizeOfQueue(0);
            },
            enqueue(value: T) {
                const node = createQueueNode(value);

                if (!headNode.current) {
                    headNode.current = node;
                } else if (tailNode.current) {
                    tailNode.current.nextNode = node;
                }
                tailNode.current = node;
                setSizeOfQueue(oldSize => oldSize + 1);
            },
            dequeue() {
                if (!headNode.current) {
                    return null;
                }

                const { nextNode } = headNode.current;
                headNode.current = nextNode;

                setSizeOfQueue(oldSize => {
                    // 注意处理0的情况
                    if (oldSize === 0) {
                        return 0;
                    }

                    return oldSize - 1;
                });
                return nextNode?.value ?? null;
            },
            forEach,
            /** Get a read-only deep copy of the queue object */
            getCopyOfQueue() {
                if (!headNode.current) {
                    return null;
                }

                const deepCopied = deepClone(headNode.current);
                return deepFreeze(deepCopied) as Readonly<typeof deepCopied>;
            },
            map<Return = unknown>(mapMethod: IterMethod<Return>): Return[] {
                const res: Return[] = [];
                forEach((value, index, curNode) => {
                    res.push(mapMethod(value, index, curNode));
                });

                return res;
            },
            toArray(): T[] {
                const res: T[] = [];
                forEach(value => {
                    res.push(value);
                });

                return res;
            },
        };
    }, [sizeOfQueue]);

    return [sizeOfQueue, methods] as const;
};
