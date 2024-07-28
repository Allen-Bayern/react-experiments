// eslint-disable-next-line no-unused-vars
type IterMethod<T, Return = void> = (item: T, index: number, q: Queue<T>) => Return;

const createNode = <T>(value: T): LinkedNode<T> => ({
    value,
    nextNode: null,
});

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

        this.__head = this.__head?.nextNode ?? null;
        this.__size--;

        return poppedNode.value;
    }

    enqueue(v: T) {
        const currentNode = createNode(v);

        if (!this.__head) {
            this.__head = currentNode;
        } else if (this.__tail) {
            this.__tail.nextNode = currentNode;
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
            ({ nextNode: currentNode } = currentNode);
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

    toArray() {
        return this.map(item => item);
    }

    *[Symbol.iterator]() {
        let currentNode = this.__head;

        while (currentNode) {
            yield currentNode.value;
            ({ nextNode: currentNode } = currentNode);
        }
    }
}
