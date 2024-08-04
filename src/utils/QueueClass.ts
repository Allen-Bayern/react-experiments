type IterMethod<T, Return = void> = (item: T, index: number, q: Queue<T>) => Return;

const createNode = <T>(value: T): LinkedNode<T> => ({
    value,
    nextNode: null,
});

export class Queue<T = unknown> {
    private __head: LinkedNode<T> | null = null;
    private __tail: LinkedNode<T> | null = null;
    private __size = 0;

    private _enqueueOne(v: T) {
        const node = createNode(v);

        if (!this.__head) {
            this.__head = node;
        } else if (this.__tail) {
            this.__tail.nextNode = node;
        }

        this.__tail = node;
        this.__size++;
    }

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

    enqueue(...values: T[]) {
        values.forEach(val => {
            this._enqueueOne(val);
        });
    }

    forEach(cb: IterMethod<T>) {
        let realIndex = 0;
        let { __head: currentNode } = this;

        while (currentNode) {
            cb(currentNode.value, realIndex++, this);
            ({ nextNode: currentNode } = currentNode);
        }
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

    get size() {
        return this.__size;
    }

    *[Symbol.iterator]() {
        let currentNode = this.__head;

        while (currentNode) {
            yield currentNode.value;
            ({ nextNode: currentNode } = currentNode);
        }
    }

    static createQueue<U>(initIterValue: Iterable<U>) {
        return new Queue<U>([...initIterValue]);
    }
}
