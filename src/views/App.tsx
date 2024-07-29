import { useEffect } from 'react';
import { useQueue } from '@/hooks';
import { getRandomInt } from '@/utils';
import './_App.scss';

function App() {
    const queue = useQueue<number>([1, 2, 3]);

    useEffect(() => {
        console.log('The Queue Updated');
        console.log(queue.toArray());
    }, [queue]);

    return (
        <div className="app-root">
            <p
                className="app-root-btn"
                onClick={() => {
                    queue.enqueue(getRandomInt());
                }}
            >
                Enqueue a random number
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    queue.enqueueWithoutRender(getRandomInt());
                }}
            >
                Enqueue a random number without re-render
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    queue.dequeue();
                }}
            >
                Dequeue
            </p>
            <p
                className="app-root-btn"
                onClick={() => {
                    queue.clear();
                }}
            >
                Clear the queue
            </p>

            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(queue.size);
                }}
            >
                Get size of the queue
            </p>

            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(queue.getReadonlyCopyOfQueue());
                }}
            >
                See the queue
            </p>

            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(queue.map(val => 2 * val));
                }}
            >
                Map new array
            </p>

            <p
                className="app-root-btn"
                onClick={() => {
                    console.log(queue.toArray());
                }}
            >
                to Array
            </p>
        </div>
    );
}

export default App;
