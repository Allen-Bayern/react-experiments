import { useSortedNumList, useTimeoutFn } from '@/hooks';
import { getRandomInt } from '@/utils';

const TO = 10000;

function App() {
    const [randomArray, methodsOfRandomArray] = useSortedNumList();

    useTimeoutFn(() => {
        console.log('hello');
    }, 8 * 1000);

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
                    methodsOfRandomArray.filter(v => v > 2000);
                }}
            >
                Filter the value more than 2000
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
                    methodsOfRandomArray.reverse();
                }}
            >
                Reverse
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
