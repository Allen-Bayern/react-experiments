import { useEffect } from 'react';
import { useList } from '@/hooks';

const { random, floor } = Math;

function getRandomInt(
    opts: Partial<{
        from: number;
        to: number;
    }> = {}
) {
    const { from = 0, to = 100 } = opts;

    if (to < from) {
        throw new Error('The "to" should not be less than the "from".');
    }

    if (from === to && !from) {
        return 0;
    }

    const maxRandom = random() * to;

    if (maxRandom < from) {
        return floor(from);
    }

    return floor(maxRandom);
}

const TO = 10000;

function App() {
    const [randomArray, methodsOfRandomArray] = useList<number[]>();

    useEffect(() => {
        console.log(randomArray);
    }, [randomArray]);

    return (
        <div className="app-root">
            <button
                type="button"
                onClick={() => {
                    const cur = getRandomInt({
                        to: TO,
                    });
                    let numPushed = cur;
                    if (randomArray.includes(cur)) {
                        numPushed += 1;
                    }

                    methodsOfRandomArray.push(numPushed);
                }}
            >
                Add a random number to array
            </button>

            <button
                type="button"
                onClick={() => {
                    methodsOfRandomArray.clear();
                }}
            >
                Clear the array
            </button>

            <button
                type="button"
                onClick={() => {
                    methodsOfRandomArray.insert(
                        getRandomInt({
                            to: TO,
                        }),
                        1
                    );
                }}
            >
                Insert to the second position
            </button>

            <button
                type="button"
                onClick={() => {
                    const deleted = methodsOfRandomArray.deleteAsIndex(2);
                    console.log(deleted);
                }}
            >
                Delete the third element of the array
            </button>

            <button
                type="button"
                onClick={() => {
                    methodsOfRandomArray.sort((a, b) => a - b);
                }}
            >
                Sort the array
            </button>

            <div>
                {randomArray.map(int => (
                    <span
                        key={int}
                        style={{
                            marginLeft: '8px',
                            marginRight: '8px',
                        }}
                    >
                        {int}
                    </span>
                ))}
            </div>
        </div>
    );
}

export default App;
