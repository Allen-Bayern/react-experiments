import React from 'react';
import './_App.scss';

const { useRef, useCallback } = React;

function App() {
    const numInfo = useRef({
        num: 0,
        get num2() {
            return Math.floor(this.num / 2);
        },
    });

    const addOne = useCallback(() => {
        numInfo.current.num += 1;
    }, []);

    const printLatestNum = useCallback(() => {
        console.log(numInfo.current);
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
