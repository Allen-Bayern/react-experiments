import React from 'react';
import styles from './_app-style.module.scss';
import { Button } from 'antd';

const { useState } = React;
const App: React.FC = () => {
    const [count, setCount] = useState(0);

    const addOne = () => {
        setCount(v => v + 1);
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>React Starter</h1>
            <p className={styles.count}>{count}</p>
            <Button onClick={addOne}>Click here to add count!</Button>
        </div>
    );
};

export default App;
