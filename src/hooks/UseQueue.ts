import { useState, useRef, useMemo } from 'react';

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

    const [currentNode, setCurrentNode] = useState<MaybeQueueNode<T>>(null);

    const headNode = useRef<MaybeQueueNode<T>>(null);
    const tailNode = useRef<MaybeQueueNode<T>>(null);

    const queueSize = useRef(0);

    // forEach method for the queue
    const forEach = (iterMethod: IterMethod) => {
        if (!currentNode && !queueSize.current) {
            return;
        }

        let currentIndex = 0;
        let { current: curNode } = headNode;
        while (curNode) {
            iterMethod(curNode.value, currentIndex++, curNode);
            ({ nextNode: curNode } = curNode);
        }
    };

    const methods = useMemo(() => {
        return {
            clear() {
                headNode.current = null;
                tailNode.current = null;
                queueSize.current = 0;
                setCurrentNode(null);
            },
            enqueue(value: T) {
                const node = createQueueNode(value);

                if (!headNode.current) {
                    headNode.current = node;
                } else if (tailNode.current) {
                    tailNode.current.nextNode = node;
                }

                tailNode.current = node;
                queueSize.current++;
                setCurrentNode(tailNode.current);
            },
            dequeue() {
                if (!headNode.current) {
                    return null;
                }

                const { nextNode } = headNode.current;
                headNode.current = nextNode;
                queueSize.current--;

                setCurrentNode(nextNode);
                return nextNode?.value ?? null;
            },
            forEach,
            getSize: () => queueSize.current,
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
    }, [currentNode]);

    return [currentNode, methods] as const;
};
