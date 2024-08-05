const createNode = <T>(value: T): BiDirectionNode<T> => ({
    value,
    prevNode: null,
    nextNode: null,
});

export class LinkedList<T> {
    private __head: LinkedNode<T> | null = null;
    private __tail: LinkedNode<T> | null = null;
    private __size = 0;
}
