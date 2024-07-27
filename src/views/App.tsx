import React from 'react';
import { useQueue } from '@/hooks';
import { getRandomInt } from '@/utils';
import './_App.scss';

const { useEffect } = React;

function App() {
    const [curNode, methodsOfQueue] = useQueue<number>();

    useEffect(() => {
        console.log('current node: ', curNode);
    }, [curNode]);

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
                    methodsOfQueue.forEach((v, i) => {
                        console.log('The value: ', v);
                        console.log('Index: ', i);
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
