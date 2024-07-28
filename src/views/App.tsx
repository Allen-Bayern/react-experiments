import { useEffect } from 'react';
import { useQueue } from '@/hooks';
import { getRandomInt } from '@/utils';
import './_App.scss';

function App() {
    const [sizeOfQueue, methodsOfQueue] = useQueue<number>([1, 2, 3]);

    useEffect(() => {
        console.log(sizeOfQueue);
    }, [sizeOfQueue]);

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
                    methodsOfQueue.enqueueWithoutRender(getRandomInt());
                }}
            >
                Enqueue a random number without re-render
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
                    console.log(methodsOfQueue.getSize());
                }}
            >
                Get size of the queue
            </p>

            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(methodsOfQueue.getCopyOfQueue());
                }}
            >
                See the queue
            </p>

            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(methodsOfQueue.map(val => 2 * val));
                }}
            >
                Map new array
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
