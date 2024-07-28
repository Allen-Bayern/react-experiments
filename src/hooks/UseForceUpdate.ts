import { useState, useCallback } from 'react';

export const useForceUpdate = () => {
    const stateTrigger = useState(false)[1];

    return useCallback(() => {
        stateTrigger(o => !o);
    }, []);
};
