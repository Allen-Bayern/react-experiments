import { UNDEFINED } from './constants';

export class LinkedNode<T = unknown> {
    public next: LinkedNode<T> | null = null;
    private __value: T | null = null;

    constructor(v: T) {
        this.__value = v;
    }

    get value() {
        return this.__value;
    }
}

export class Queue<T = unknown> {
    private __head: LinkedNode<T> | null = null;
    private __tail: LinkedNode<T> | null = null;
    private __size = 0;

    constructor(arr: T[] = []) {
        this.clear();
        if (!arr.length) {
            return;
        }

        arr.forEach(item => {
            this.enqueue(item);
        });
    }

    clear() {
        this.__head = null;
        this.__tail = null;
        this.__size = 0;
    }

    enqueue(v: T) {
        const currentNode = new LinkedNode(v);

        if (!this.__head) {
            this.__head = currentNode;
        } else {
            this.__tail!.next = currentNode;
        }

        this.__tail = currentNode;
        this.__size += 1;
    }

    dequeue() {
        const poppedNode = this.__head;
        if (!poppedNode) {
            return null;
        }

        this.__head = this.__head?.next ?? null;
        this.__size -= 1;

        return poppedNode.value;
    }

    peek() {
        if (!this.__head) {
            return null;
        }

        return this.__head.value;
    }

    get size() {
        return this.__size;
    }

    // eslint-disable-next-line no-unused-vars
    forEach(cb: (item: T, index: number, q: Queue<T>) => void) {
        const self = this;
        let realIndex = 0;
        let currentNode = this.__head;

        while (currentNode && currentNode.value !== null && currentNode.value !== UNDEFINED) {
            const { value: currentValue } = currentNode;
            cb(currentValue, realIndex, self);
            realIndex += 1;
            currentNode = currentNode.next;
        }
    }

    *[Symbol.iterator]() {
        let currentNode = this.__head;

        while (currentNode) {
            yield currentNode.value;
            currentNode = currentNode.next;
        }
    }
}
