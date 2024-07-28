import { useState, useRef, useMemo, useCallback, useEffect } from 'react';
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

    const headNode = useRef<MaybeQueueNode<T>>(null);
    const tailNode = useRef<MaybeQueueNode<T>>(null);

    // clear the queue without rerender
    const clearMethod = useCallback(() => {
        headNode.current = null;
        tailNode.current = null;
    }, []);

    // enqueue without rerender
    const enqueueMethod = useCallback((val: T) => {
        const node = createQueueNode(val);

        if (!headNode.current) {
            headNode.current = node;
        } else if (tailNode.current) {
            tailNode.current.nextNode = node;
        }

        tailNode.current = node;
    }, []);

    // forEach method for the queue
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

    // methods没有重新创建的任何必要
    const methods = useMemo(
        () => ({
            clear() {
                clearMethod();
                setSizeOfQueue(() => 0);
            },
            enqueue(value: T) {
                enqueueMethod(value);
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
                    if (!oldSize) {
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
        }),
        []
    );

    useEffect(() => {
        clearMethod();

        if (initValueAsArray.length) {
            initValueAsArray.forEach(item => {
                enqueueMethod(item);
            });
        }
    }, []);

    return [sizeOfQueue, methods] as const;
};
