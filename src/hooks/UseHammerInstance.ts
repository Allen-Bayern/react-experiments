import { useRef, useEffect, useCallback } from 'react';
import deepEqual from 'fast-deep-equal/react';
import Hammer from 'hammerjs';

type HammerDom = ConstructorParameters<typeof Hammer>[0];
type HammerOptions = ConstructorParameters<typeof Hammer>[1];

/**
 * 用于创建`Hammer.js`实例的hook
 * @param scopeDom - 作用域DOM，默认`document.body`。一般情况下传入页面根元素`ref.current`
 * @param opts - Hammerjs选项，对应Hammer构造函数
 * @returns `getter`函数，用于获取`Hammer`实例
 */
export function useHammerInstance(scopeDom: HammerDom = document.body, opts: HammerOptions = {}) {
    const optsRef = useRef(opts);
    useEffect(() => {
        if (!deepEqual(opts, optsRef)) {
            optsRef.current = opts;
        }
    }, [opts]);

    const hammerInst = useRef<InstanceType<typeof Hammer> | null>(null);

    // Mount hammer instance
    useEffect(() => {
        if (!hammerInst.current) {
            hammerInst.current = new Hammer(scopeDom, optsRef.current);
        }

        return () => {
            if (hammerInst.current) {
                hammerInst.current.destroy();
                hammerInst.current = null;
            }
        };
    }, []);

    // a getter for hammer instance
    const getHammerInstance = useCallback(() => {
        if (!hammerInst.current) {
            hammerInst.current = new Hammer(scopeDom, optsRef.current);
        }

        return hammerInst.current;
    }, []);

    return getHammerInstance;
}
