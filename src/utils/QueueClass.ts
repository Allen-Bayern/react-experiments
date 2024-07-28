// eslint-disable-next-line no-unused-vars
type IterMethod<T, Return = void> = (item: T, index: number, q: Queue<T>) => Return;

export class LinkedNode<T = unknown> {
    public next: LinkedNode<T> | null = null;
    public value: T;

    constructor(v: T) {
        this.value = v;
    }
}

export class Queue<T = unknown> {
    private __head: LinkedNode<T> | null = null;
    private __tail: LinkedNode<T> | null = null;
    private __size = 0;

    constructor(arr: T[] = []) {
        this.clear();

        if (arr.length) {
            arr.forEach(item => {
                this.enqueue(item);
            });
        }
    }

    clear() {
        this.__head = null;
        this.__tail = null;
        this.__size = 0;
    }

    dequeue() {
        const poppedNode = this.__head;
        if (!poppedNode) {
            return null;
        }

        this.__head = this.__head?.next ?? null;
        this.__size--;

        return poppedNode.value;
    }

    enqueue(v: T) {
        const currentNode = new LinkedNode(v);

        if (!this.__head) {
            this.__head = currentNode;
        } else if (this.__tail) {
            this.__tail.next = currentNode;
        }

        this.__tail = currentNode;
        this.__size++;
    }

    // eslint-disable-next-line no-unused-vars
    forEach(cb: IterMethod<T>) {
        let realIndex = 0;
        let { __head: currentNode } = this;

        while (currentNode) {
            cb(currentNode.value, realIndex++, this);
            ({ next: currentNode } = currentNode);
        }
    }

    get size() {
        return this.__size;
    }

    map<R = unknown>(cb: IterMethod<T, R>) {
        const res: R[] = [];

        this.forEach((item, index, self) => {
            res.push(cb(item, index, self));
        });

        return res;
    }

    peek() {
        return this.__head?.value ?? null;
    }

    *[Symbol.iterator]() {
        let currentNode = this.__head;

        while (currentNode) {
            yield currentNode.value;
            ({ next: currentNode } = currentNode);
        }
    }
}
