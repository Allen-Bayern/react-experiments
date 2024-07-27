import { useEffect } from 'react';
import { useQueue } from '@/hooks';
import { getRandomInt } from '@/utils';
import './_App.scss';

function App() {
    const [queue, methodsOfQueue] = useQueue<number>();

    useEffect(() => {
        console.log(queue);
    }, [queue]);

    return (
        <div className="app-root">
            <p
                className="app-root-btn"
                onClick={() => {
                    methodsOfQueue.enqueue(getRandomInt());
                }}
            >
                Enqueue a random number
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    methodsOfQueue.dequeue();
                }}
            >
                Dequeue
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    methodsOfQueue.clear();
                }}
            >
                Clear the queue
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    methodsOfQueue.forEach(val => {
                        console.log(val);
                    });
                }}
            >
                See the queue
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(methodsOfQueue.getSize());
                }}
            >
                Get Size
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(methodsOfQueue.toArray());
                }}
            >
                to Array
            </p>
        </div>
    );
}

export default App;
