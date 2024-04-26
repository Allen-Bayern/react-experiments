import { useState, useCallback } from 'react';

/**
 * @description
 * A hook for force updating.
 *
 * **How to use?**
 *
 * @example
 *
 * ```js
 * import React, { useRef, useEffect } from 'react';
 * import { useForceUpdate } from '@/hooks';
 *
 * function ExamplePage() {
 *   // call useForceUpdate to get forceUpdate method
 *   const forceUpdate = useForceUpdate();
 *
 *   const refValue = useRef(0);
 *
 *   function addOne() {
 *     if (!(refValue.current++ % 5)) {
 *       // When refValue.current % 5 === 0, update the page
 *       forceUpdate();
 *     }
 *   };
 *
 *   useEffect(() => {
 *     const interTimer = setInterval(() => {
 *       addOne();
 *       if (refValue.current === 200) {
 *         clearInterval(interTimer);
 *       }
 *     }, 200);
 *
 *     return () => {
 *       if (interTimer) clearInterval(interTimer);
 *     };
 *   }, []);
 *
 *   return <p>{refValue.current}</p>;
 * }
 *
 * export default ExamplePage;
 * ```
 */

export function useForceUpdate() {
    const setCurrentDatum = useState(false)[1];

    /** @description force update method */
    const forceUpdateMethod = useCallback(() => {
        setCurrentDatum(oldValue => !oldValue);
    }, []);

    return forceUpdateMethod;
}
