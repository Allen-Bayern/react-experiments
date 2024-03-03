import React from 'react';
import { Button } from 'antd';
import { useForceRender } from '@/hooks';

import styles from './_app-style.module.scss';

const { useRef, useCallback } = React;

const App: React.FC = () => {
    const { forceRender } = useForceRender();
    const countNumber = useRef(0);

    const addOne = useCallback(() => {
        countNumber.current += 1;
        if (!(countNumber.current % 5)) {
            forceRender();
        }
    }, []);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>React Starter</h1>
            <p className={styles.count}>{countNumber.current}</p>
            <Button onClick={addOne}>Click here to add count!</Button>
        </div>
    );
};

export default App;
