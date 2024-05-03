import React from 'react';
import { useFunction } from '@/hooks';

const { useState } = React;

function App() {
    const [countNum, setCountNum] = useState(0);

    // 记忆化函数
    const addNum = useFunction(
        (() => {
            if (countNum >= 10) {
                return () => {
                    setCountNum(oldVal => oldVal + 1);
                };
            }
            return () => {
                setCountNum(oldVal => oldVal + 2);
            };
        })()
    );

    return (
        <>
            <p>{countNum}</p>
            <button onClick={addNum}>+Num</button>
        </>
    );
}

export default App;
