import React, { useRef, useEffect } from 'react';
import { useForceUpdate } from '@/hooks';

function App() {
    const forceUpdate = useForceUpdate();
    const refValue = useRef(0);
    useEffect(() => {
        const timer = setInterval(() => {
            if (!(++refValue.current % 5)) {
                forceUpdate();
            }
        }, 200);

        return () => {
            timer && clearInterval(timer);
        };
    }, []);

    return <div className="App">{refValue.current}</div>;
}

export default App;
