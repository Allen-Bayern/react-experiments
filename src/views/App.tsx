import { useState } from 'react';
import { usePolling } from '@/hooks';

function App() {
    const [num, setNum] = useState(0);

    const { startPolling, stopPolling } = usePolling(() => {
        setNum(n => (n += 1));
    });

    return (
        <div className="app-root">
            <button
                type="button"
                onClick={startPolling}
            >
                start polling
            </button>

            <button
                type="button"
                onClick={stopPolling}
            >
                stop polling
            </button>

            <p>{num}</p>
        </div>
    );
}

export default App;
