type noop = (this: any, ...args: any[]) => any;

type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;

type BaseFunc = (...args: any[]) => any;

type ArrayElement<T> = T extends (infer U)[] ? U : never;

interface LinkedNode<T> {
    value: T;
    nextNode: LinkedNode<T> | null;
}
