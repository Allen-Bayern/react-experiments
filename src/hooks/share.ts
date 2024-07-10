// eslint-disable-next-line no-unused-vars
export type noop = (this: any, ...args: any[]) => any;

// eslint-disable-next-line no-unused-vars
export type PickFunction<T extends noop> = (this: ThisParameterType<T>, ...args: Parameters<T>) => ReturnType<T>;

// eslint-disable-next-line
export type BaseFunc = (...args: any[]) => any;
