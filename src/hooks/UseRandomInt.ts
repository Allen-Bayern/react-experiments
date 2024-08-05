import { useRef, useEffect, useState, useCallback } from 'react';
import { getRandomInt } from '@/utils';

const useRandomInt = (
    opts: Parameters<typeof getRandomInt>[0] = {
        from: 0,
        to: 100,
    }
) => {
    const { from, to } = opts;
    const randomIntOpt = useRef(opts);
    useEffect(() => {
        randomIntOpt.current = { from, to };
    }, [from, to]);

    const [randomInt, setRandomInt] = useState(getRandomInt(randomIntOpt.current));
    const updateRandomInt = useCallback(() => {
        setRandomInt(old => {
            const tmp = getRandomInt(randomIntOpt.current);

            if (old === tmp) {
                return old + 1;
            }

            return tmp;
        });
    }, []);

    return [randomInt, updateRandomInt] as const;
};

export default useRandomInt;
