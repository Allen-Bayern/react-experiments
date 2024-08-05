import { useRef, useCallback, useEffect, useMemo } from 'react';
import useRandomInt from './UseRandomInt';

const createBiDirectionNode = <T = unknown>(value: T): BiDirectionNode<T> => ({
    prevNode: null,
    nextNode: null,
    value,
});

export const useLinkedList = <T = unknown>(initVal: Iterable<T> | null = null) => {
    const [randomInt, updateRandomInt] = useRandomInt();

    // private refs
    const _headNode = useRef<BiDirectionNode<T> | null>(null);
    const _tailNode = useRef<BiDirectionNode<T> | null>(null);

    // middleNode
    const _midNode = useRef<BiDirectionNode<T> | null>(null);
    const _prevIndex = useRef(0);

    const _sizeInfo = useRef({
        size: 0,
        get midIndex() {
            return Math.floor(this.size / 2);
        },
    });

    // private methods
    const _updateMiddleNode = useCallback(() => {
        if ((!_headNode.current || !_tailNode.current) && !_sizeInfo.current.size) {
            _midNode.current = null;
            return;
        }

        // 首次入队时更新一遍
        if (!_midNode.current) {
            let count = 0;
            let currentNode: BiDirectionNode<T> | null = _headNode.current;

            const { midIndex } = _sizeInfo.current;

            while (count <= midIndex && currentNode) {
                if (count === midIndex) {
                    _midNode.current = currentNode;
                    break;
                } else {
                    ({ nextNode: currentNode } = currentNode);
                    count++;
                }
            }

            _prevIndex.current = midIndex;

            return;
        }

        const { midIndex: latestMidIndex } = _sizeInfo.current;
        const steps = latestMidIndex - _prevIndex.current;

        let { current: tempNode } = _midNode;
        let count = Math.abs(steps);

        while (count && steps) {
            if (steps > 0) {
                tempNode = tempNode.nextNode as BiDirectionNode<T>;
            } else if (steps < 0) {
                tempNode = tempNode.prevNode as BiDirectionNode<T>;
            }

            count -= 1;
        }

        _midNode.current = tempNode;
        _prevIndex.current = latestMidIndex;
    }, []);

    // eslint-disable-next-line @typescript-eslint/no-inferrable-types
    const _subscribe = useCallback((isUpdateRandom: boolean = true) => {
        _updateMiddleNode();

        if (isUpdateRandom) {
            updateRandomInt();
        }
    }, []);

    const _enqueueOne = useCallback((value: T) => {
        const newNode = createBiDirectionNode(value);

        if (!_headNode.current) {
            _headNode.current = newNode;
            _tailNode.current = newNode;
            _sizeInfo.current.size = 1;

            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        _tailNode.current!.nextNode = newNode;
        _sizeInfo.current.size += 1;
    }, []);

    const _shift = useCallback(() => {
        if (!_headNode.current) {
            return null;
        }

        const { current: currentNode } = _headNode;
        const { value } = currentNode;
        ({ nextNode: _headNode.current } = currentNode);

        _sizeInfo.current.size -= 1;

        return value;
    }, []);

    const _pop = useCallback(() => {
        if (!_tailNode.current) {
            return null;
        }

        const { current: currentNode } = _tailNode;
        const { value } = currentNode;
        ({ nextNode: _tailNode.current } = currentNode);

        _sizeInfo.current.size -= 1;

        return value;
    }, []);

    // public methods
    const forEach = useCallback((method: (value: T, index: number) => void): void => {
        if (!_headNode.current) {
            return;
        }

        let currentNode: BiDirectionNode<T> | null = _headNode.current;
        let currentIndex = 0;
        while (currentNode) {
            method(currentNode.value, currentIndex++);
            ({ nextNode: currentNode } = currentNode);
        }
    }, []);

    useEffect(() => {
        if (initVal) {
            for (const item of initVal) {
                _enqueueOne(item);
            }

            _subscribe(false);
        }
    }, []);

    const linkedList = useMemo(() => {
        return {
            atIndex(i: number): T {
                const { size, midIndex } = _sizeInfo.current;

                if (!_headNode.current || !_tailNode.current) {
                    throw new Error('No element exists at the list');
                }

                if (i < 0 || i >= size) {
                    throw new RangeError(`The ${i}-th element is not at the list!`);
                }

                // 直接返回
                if (!i) {
                    return _headNode.current.value;
                }

                if (i === size - 1) {
                    return _tailNode.current.value;
                }

                // 二分查找
                let step = i - midIndex;
                if (!step) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    return _midNode.current!.value;
                }

                let currentNode = _midNode.current;
                while (step) {
                    if (step < 0) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        currentNode = currentNode!.prevNode;
                        step += 1;
                    } else {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        currentNode = currentNode!.nextNode;
                        step -= 1;
                    }
                }

                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                return currentNode!.value;
            },
            forEach,
            includes(elem: T): boolean {
                if (!_headNode.current || !_tailNode.current) {
                    return false;
                }

                let currentNode: BiDirectionNode<T> | null = _headNode.current;
                let count = 0;
                while (count < _sizeInfo.current.size && currentNode) {
                    if (currentNode.value === elem) {
                        return true;
                    }

                    ({ nextNode: currentNode } = currentNode);
                    count += 1;
                }

                return false;
            },
            indexOf(elem: T): number {
                if (!_headNode.current || !_tailNode.current) {
                    return -1;
                }

                let currentNode: BiDirectionNode<T> | null = _headNode.current;
                let count = 0;
                while (count < _sizeInfo.current.size && currentNode) {
                    if (currentNode.value === elem) {
                        return count;
                    }

                    ({ nextNode: currentNode } = currentNode);
                    count += 1;
                }

                return -1;
            },
            map<R = unknown>(method: (value: T, index: number) => R): R[] {
                const res: R[] = [];
                forEach((value, index) => {
                    res.push(method(value, index));
                });

                return res;
            },
            pop(): T | null {
                const popped = _pop();
                _subscribe();
                return popped;
            },
            popWithoutRender(): T | null {
                const popped = _pop();
                _subscribe(false);
                return popped;
            },
            push(...values: T[]): boolean {
                if (values.length) {
                    values.forEach(value => {
                        _enqueueOne(value);
                    });

                    _subscribe();

                    return true;
                }

                return false;
            },
            pushWithoutRender(...values: T[]): boolean {
                if (values.length) {
                    values.forEach(value => {
                        _enqueueOne(value);
                    });
                    _subscribe(false);

                    return true;
                }

                return false;
            },
            shift(): T | null {
                const shifted = _shift();
                _subscribe();
                return shifted;
            },
            shiftWithoutRender(): T | null {
                const shifted = _shift();
                _subscribe(false);
                return shifted;
            },
            toArray(): T[] {
                const res: T[] = [];
                forEach(val => {
                    res.push(val);
                });

                return res;
            },

            // getters
            get size(): number {
                return _sizeInfo.current.size;
            },

            // iter
            *[Symbol.iterator]() {
                if (!_headNode.current || !_tailNode.current) {
                    return;
                }

                let currentNode: BiDirectionNode<T> | null = _headNode.current;
                while (currentNode) {
                    yield currentNode.value;
                    currentNode = currentNode.nextNode;
                }
            },
        };
    }, [randomInt]);

    return linkedList;
};
