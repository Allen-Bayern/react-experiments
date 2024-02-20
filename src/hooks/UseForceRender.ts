import { useRef, useState, useCallback } from 'react';

/** @description force render function */
export const useForceRender = () => {
    const [currentNum, setCurrentNum] = useState(0);
    const currentStat = useRef(false);

    // 强制更新函数
    const forceRender = useCallback(() => {
        currentStat.current = !currentStat.current;
        // 在01之间反复横跳
        setCurrentNum(+currentStat.current);
    }, []);

    return {
        currentNum,
        forceRender,
    };
};
