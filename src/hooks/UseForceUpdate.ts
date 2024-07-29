import { useState, useCallback } from 'react';
import { getRandomInt } from '@/utils';

export const useForceUpdate = () => {
    const [, setRandomInt] = useState(getRandomInt());
    return useCallback(() => {
        setRandomInt(oldValue => {
            const tmp = getRandomInt();
            return tmp === oldValue ? oldValue + 1 : tmp;
        });
    }, []);
};
