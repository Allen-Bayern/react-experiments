import { useEffect } from 'react';

// eslint-disable-next-line no-unused-vars
export function useVisibilityChange<T extends (...args: any[]) => any>(fn: T) {
    useEffect(() => {
        function inner() {
            document.addEventListener('visibilitychange', fn);
            return () => {
                document.removeEventListener('visibilitychange', fn);
            };
        }

        return inner();
    }, []);
}
