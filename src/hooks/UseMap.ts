import { useCallback, useState, useMemo } from 'react';

export function useMap<Key = unknown, Value = unknown>(initValue: Iterable<readonly [Key, Value]> = []) {
    const getInitValue = useCallback(() => new Map(initValue), [initValue]);

    const [map, setMap] = useState(getInitValue);

    const cover = useCallback((nm: Iterable<readonly [Key, Value]> = getInitValue()) => {
        setMap(new Map(nm));
    }, []);

    const methods = useMemo(() => {
        return {
            // 追加, 不是覆盖
            batchSet(kvs: Iterable<readonly [Key, Value]>) {
                setMap(prev => {
                    return new Map([...prev, ...kvs]);
                });
            },
            // 批量删除
            batchRemove(deletedKeyList: Iterable<Key>) {
                setMap(prev => {
                    const newMap = new Map(prev);

                    for (const k of deletedKeyList) {
                        if (newMap.has(k)) {
                            newMap.delete(k);
                        }
                    }
                    return newMap;
                });
            },
            cover,
            clear() {
                setMap(new Map<Key, Value>());
            },
            remove(k: Key) {
                if (!map.has(k)) {
                    console.warn(`The key ${k} is not found in the map.`);
                    return false;
                }

                setMap(prev => {
                    const newMap = new Map(prev);
                    newMap.delete(k);
                    return newMap;
                });

                return true;
            },
            reset() {
                cover(getInitValue());
            },
            set(k: Key, v: Value) {
                setMap(prev => {
                    const newMap = new Map(prev);
                    newMap.set(k, v);
                    return newMap;
                });
            },
        };
    }, [map]);

    return [map, methods] as const;
}
