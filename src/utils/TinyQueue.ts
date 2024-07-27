import deepFreeze from 'deep-freeze-strict';
import deepCopy from 'clone';

export interface QueueNode<T> {
    nextNode: QueueNode<T> | null;
    value: T;
}

const createNode = <T>(value: T): QueueNode<T> => ({
    nextNode: null,
    value,
});

export const createQueue = <T = unknown>(initValuesAsArray: T[] = []) => {
    let _head: QueueNode<T> | null = null;
    let _tail: QueueNode<T> | null = null;
    let _size = 0;

    const clear = () => {
        _head = null;
        _tail = null;
        _size = 0;
    };

    const dequeue = () => {
        if (!_head) {
            return null;
        }

        const headNode = _head;
        ({ nextNode: _head } = headNode);
        _size--;
        return headNode.value;
    };

    const enqueue = (value: T) => {
        const node = createNode(value);
        if (!_head && !_tail) {
            _head = node;
        } else if (_tail) {
            _tail.nextNode = node;
        }

        _tail = node;
        _size++;
    };

    // eslint-disable-next-line no-unused-vars
    const forEach = (method: (value: T, index: number) => void): void => {
        if (!_head) {
            return;
        }

        let currentNode: QueueNode<T> | null = _head;
        let currentIndex = 0;

        while (currentNode) {
            const { value: currentValue } = currentNode;
            method(currentValue, currentIndex++);
            ({ nextNode: currentNode } = currentNode);
        }
    };

    const getReadonlyCopyOfQueue = () => {
        const copied = deepCopy(_head);
        return deepFreeze(copied) as Readonly<typeof _head>;
    };

    const getSize = () => _size;

    // eslint-disable-next-line no-unused-vars
    const map = <R = unknown>(method: (value: T, index: number) => R) => {
        const res: R[] = [];
        forEach((val, index) => {
            res.push(method(val, index));
        });

        return res;
    };

    const peek = () => _head?.value ?? null;

    const toArray = () => {
        const res: T[] = [];
        forEach(value => {
            res.push(value);
        });

        return res;
    };

    // init
    const _init = () => {
        clear();
        if (initValuesAsArray.length) {
            initValuesAsArray.forEach(item => {
                enqueue(item);
            });
        }
    };

    _init();

    return {
        clear,
        dequeue,
        enqueue,
        forEach,
        getReadonlyCopyOfQueue,
        getSize,
        map,
        peek,
        toArray,
    };
};
