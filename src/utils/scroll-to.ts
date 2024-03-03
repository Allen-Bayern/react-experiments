export const getScrollTop = (element: Element | Window) => {
    const top = 'scrollTop' in element ? element.scrollTop : element.scrollY;

    // iOS scroll bounce cause minus scrollTop
    return Math.max(top, 0);
};

export const getScrollLeft = (element: Element | Window) => {
    const left = 'scrollLeft' in element ? element.scrollLeft : element.scrollX;

    return Math.max(left, 0);
};

interface ScrollToOptions {
    top?: number;
    left?: number;
    duration?: number;
    animation(progress: number): number;
}

export function scrollTo(
    element: HTMLElement | Window,
    { top = 0, left = 0, duration = 300, animation }: ScrollToOptions
): Promise<void> {
    const startTime = Date.now();

    const scrollTop = getScrollTop(element);
    const scrollLeft = getScrollLeft(element);

    return new Promise(resolve => {
        const frame = () => {
            const progress = (Date.now() - startTime) / duration;

            if (progress < 1) {
                const nextTop = scrollTop + (top - scrollTop) * animation(progress);
                const nextLeft = scrollLeft + (left - scrollLeft) * animation(progress);

                element.scrollTo(nextLeft, nextTop);
                requestAnimationFrame(frame);
            } else {
                element.scrollTo(left, top);
                resolve();
            }
        };

        requestAnimationFrame(frame);
    });
}

export const linear = (value: number): number => value;

// function scrollToCenter(element: HTMLElement) {
//     if (!localScrollable.value) {
//         return;
//     }

//     // 父元素
//     const scroller: HTMLElement = element as HTMLElement;
//     // 子元素
//     const el = element.value as HTMLElement;

//     const top: number = el.offsetTop + el.offsetHeight / 2 - scroller.offsetHeight / 2;
//     scrollTo(scroller, {
//         top,
//         animation: linear,
//     });

//     if (props.layoutDirection === 'horizontal') {
//         const left: number = el.offsetLeft + el.offsetWidth / 2 - scroller.offsetWidth / 2;
//         scrollTo(scroller, {
//             left,
//             animation: linear,
//         });
//     } else {
//         const top: number = el.offsetTop + el.offsetHeight / 2 - scroller.offsetHeight / 2;
//         scrollTo(scroller, {
//             top,
//             animation: linear,
//         });
//     }
// }
