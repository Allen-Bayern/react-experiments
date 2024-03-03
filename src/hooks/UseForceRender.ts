import { useRef, useState, useCallback } from 'react';

/** @description force render hook */
export const useForceRender = () => {
    const currentStatus = useRef(false);
    const [currentNum, setCurrentNum] = useState(+currentStatus.current);

    // 强制更新函数
    const forceRender = useCallback(() => {
        currentStatus.current = !currentStatus.current;
        // 在01之间反复横跳
        setCurrentNum(+currentStatus.current);
    }, []);

    return {
        currentNum,
        forceRender,
    };
};
