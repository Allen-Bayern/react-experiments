import React, { type CSSProperties, type MouseEventHandler } from 'react';
import { useImmer } from 'use-immer';
import classNames from 'classnames';
import { type CommonFWC, emptyStyle } from '@/utils';
import styles from './_style.module.scss';

const { forwardRef, useRef, useEffect } = React;

export type ModalProps = {
    visible: boolean;
} & Partial<{
    contentClass: string;
    contentStyle: CSSProperties;
    onClickShadow(): void;
}>;

const BACKDROP_BASE = 0.7;

/** @description Modal component using original `<dialog></dialog>` */
const Modal: CommonFWC<ModalProps, HTMLDialogElement> = (props, domRef) => {
    const {
        // necessary
        visible,

        // optional
        contentClass = '',
        contentStyle = emptyStyle,
        onClickShadow = null,

        // common
        className: outerClass = '',
        style: outerStyle,
        children,
    } = props;

    // dialog style
    const [dialogStyle, updateDialogStyle] = useImmer({
        opacity: 1,
        '--var-backdrop-color': `rgba(0, 0, 0, ${BACKDROP_BASE})`,
        ...outerStyle,
    });

    // doms ref
    const innerRef = useRef<HTMLDialogElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const isFirstRender = useRef(true);

    // click shadow event
    const clickShadow: MouseEventHandler<HTMLDialogElement> = ev => {
        if (ev.target === contentRef.current) {
            return;
        }

        if (onClickShadow) {
            onClickShadow();
        }
    };

    useEffect(() => {
        let inter: ReturnType<typeof setInterval> | null = null;
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (innerRef.current) {
            const { current: dialogDOM } = innerRef;

            if (visible) {
                updateDialogStyle(draft => {
                    draft.opacity = 1;
                    draft['--var-backdrop-color'] = `rgba(0, 0, 0, ${BACKDROP_BASE})`;
                });

                dialogDOM.showModal();
            } else {
                let transCount = 1;

                if (!isFirstRender.current) {
                    inter = setInterval(() => {
                        if (transCount === 10 && inter) {
                            clearInterval(inter);
                            timer = setTimeout(() => {
                                dialogDOM.close();
                            }, 100);
                        }

                        updateDialogStyle(draft => {
                            draft.opacity = 1 - 0.1 * transCount;
                            draft['--var-backdrop-color'] = `rgba(0, 0, 0, ${
                                BACKDROP_BASE - BACKDROP_BASE * 0.1 * transCount
                            })`;
                        });

                        transCount += 1;
                    }, 20);
                } else {
                    isFirstRender.current = false;
                }
            }
        }

        return () => {
            if (inter) {
                clearInterval(inter);
            }

            if (timer) {
                clearTimeout(timer);
            }
        };
    }, [visible]);

    return (
        <dialog
            ref={el => {
                innerRef.current = el;
                if (domRef) {
                    if (typeof domRef === 'function') {
                        domRef(el);
                    } else {
                        domRef.current = el;
                    }
                }
            }}
            className={classNames(styles.yModal, outerClass)}
            style={dialogStyle satisfies CSSProperties}
            onClick={clickShadow}
        >
            <div
                className={classNames(styles.yModalContent, contentClass)}
                style={contentStyle}
                ref={contentRef}
            >
                {children}
            </div>
        </dialog>
    );
};

export default forwardRef(Modal);
