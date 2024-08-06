type ForEachMethod<T, R = void> = (value: T, index: number) => R;

const createNode = <T>(value: T): BiDirectionNode<T> => ({
    value,
    prevNode: null,
    nextNode: null,
});

const { abs, floor, min } = Math;

export class LinkedList<T = unknown> {
    private __head: BiDirectionNode<T> | null = null;
    private __tail: BiDirectionNode<T> | null = null;

    private __midNode: BiDirectionNode<T> | null = null;
    private __midIndexRef = 0;

    private __sizeInfo = {
        size: 0,
        get midIndex() {
            return floor(this.size / 2);
        },
    };

    private __forEach(method: ForEachMethod<T>) {
        if (!this.__head) {
            return;
        }

        let currentNode = this.__head;
        let currentIndex = 0;

        while (currentIndex < this.__sizeInfo.size) {
            method(currentNode.value, currentIndex++);
            if (currentNode.nextNode) {
                ({ nextNode: currentNode } = currentNode);
            }
        }
    }

    private __enqueueOne(value: T, direction: 'head' | 'tail' = 'tail') {
        const newNode = createNode(value);

        if (!this.__head || !this.__tail) {
            this.__head = newNode;
            this.__tail = newNode;
            this.__sizeInfo.size = 1;

            return;
        }

        if (direction === 'tail') {
            this.__tail.nextNode = newNode;
            this.__tail = newNode;
        } else {
            this.__head.prevNode = newNode;
            this.__head = newNode;
        }

        this.__sizeInfo.size++;
    }

    private __updateMidNode() {
        if (!this.__midNode) {
            const { midIndex } = this.__sizeInfo;

            if (!midIndex) {
                this.__midNode = this.__head;
                this.__midIndexRef = midIndex;
                return;
            }

            if (this.__head && this.__tail) {
                const steps = midIndex - this.__midIndexRef;

                // update midNode
                let goStep = abs(steps);
                while (goStep) {
                    if (steps < 0) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        this.__midNode = this.__midNode!.prevNode;
                    } else if (steps > 0) {
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        this.__midNode = this.__midNode!.nextNode;
                    }

                    goStep--;
                }
            }

            this.__midIndexRef = midIndex;
        }
    }

    constructor() {
        this.clear();
    }

    public at(index: number) {
        if (!this.__head || !this.__tail || !this.__midNode) {
            return null;
        }

        const { size, midIndex } = this.__sizeInfo;

        if (abs(index) > size || (index > 0 && index === size)) {
            throw new RangeError('Out of range');
        }

        const realIndex = index >= 0 ? index : size + index;

        if (realIndex === midIndex) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            return this.__midNode!.value;
        }

        const stepFromHead = realIndex;
        const stepFromTail = size - 1 - realIndex;

        const stepFromMid = this.__midIndexRef - realIndex;
        const abstractStepFromMid = abs(this.__midIndexRef - realIndex);

        const minStep = min(stepFromHead, stepFromTail, abstractStepFromMid);

        // from middle
        if (abstractStepFromMid === minStep) {
            let steps = abstractStepFromMid;

            let currentNode = this.__midNode;
            while (steps) {
                if (stepFromMid < 0) {
                    currentNode = currentNode.prevNode as BiDirectionNode<T>;
                } else {
                    currentNode = currentNode.nextNode as BiDirectionNode<T>;
                }

                steps--;
            }

            return currentNode.value;
        }

        // from tail
        if (stepFromTail === minStep) {
            let steps = stepFromHead;

            let currentNode = this.__tail;
            while (steps) {
                currentNode = currentNode.prevNode as BiDirectionNode<T>;
                steps--;
            }

            return currentNode.value;
        }

        // from head
        let steps = stepFromHead;
        let currentNode = this.__head;
        while (steps) {
            currentNode = currentNode.nextNode as BiDirectionNode<T>;
            steps--;
        }

        return currentNode.value;
    }

    public clear() {
        this.__head = null;
        this.__tail = null;
        this.__midNode = null;
        this.__midIndexRef = 0;
        this.__sizeInfo.size = 0;
    }

    public forEach(method: ForEachMethod<T>) {
        this.__forEach(method);
    }

    public map<R = unknown>(method: ForEachMethod<T, R>): R[] {
        const res: R[] = [];
        this.__forEach((value, index) => {
            res.push(method(value, index));
        });

        return res;
    }

    public pop() {
        if (!this.__head || !this.__tail) {
            return null;
        }

        const { value: tailValue, prevNode } = this.__tail;
        this.__tail = prevNode;
        this.__updateMidNode();
        return tailValue;
    }

    public push(...values: T[]) {
        if (values.length) {
            values.forEach(v => {
                this.__enqueueOne(v);
            });

            this.__updateMidNode();
        }

        return Boolean(values.length);
    }

    public shift() {
        if (!this.__head || !this.__tail) {
            return null;
        }

        const { value: headValue, nextNode } = this.__head;
        this.__head = nextNode;
        this.__updateMidNode();
        return headValue;
    }

    public unshift(...values: T[]) {
        if (values.length) {
            [...values].reverse().forEach(v => {
                this.__enqueueOne(v, 'head');
            });

            this.__updateMidNode();
        }

        return Boolean(values.length);
    }

    // getter
    get length() {
        return this.__sizeInfo.size;
    }

    *[Symbol.iterator]() {
        let cur = this.__head;
        while (cur) {
            yield cur.value;
            cur = cur.nextNode;
        }
    }
}
