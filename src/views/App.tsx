import React from 'react';
import './_App.scss';

const { useRef, useCallback } = React;

function App() {
    const num = useRef(0);

    const addOne = useCallback(() => {
        num.current += 1;
    }, []);

    const printLatestNum = useCallback(() => {
        console.log(num.current);
    }, []);

    return (
        <div className="app-root">
            <button
                type="button"
                onClick={addOne}
            >
                add one
            </button>
            <button
                type="button"
                onClick={printLatestNum}
            >
                print latest
            </button>
        </div>
    );
}

export default App;
