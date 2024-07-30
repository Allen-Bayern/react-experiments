import { useRef, useEffect, forwardRef, memo, type CSSProperties, type MouseEventHandler } from 'react';
import { useImmer } from 'use-immer';
import classNames from 'classnames';
import { emptyStyle, type CommonFWC } from '@/utils';
import styles from './_style.module.scss';

export type ModalProps = {
    visible: boolean;
} & Partial<{
    rootClass: string;
    rootStyle: CSSProperties;
    onClickShadow(): void;
}>;

const BACKDROP_BASE = 0.7;

const Modal: CommonFWC<ModalProps, HTMLDialogElement> = (props, domRef) => {
    const {
        // necessary
        visible,

        // optional
        rootClass = '',
        rootStyle = emptyStyle,
        onClickShadow = null,

        // common
        className: innerClass = '',
        style: innerStyle = emptyStyle,
        children,
    } = props;

    // dialog style
    const [dialogStyle, updateDialogStyle] = useImmer<
        CSSProperties & {
            /** @description The css var of the background color of the dialog's backdrop. */
            '--var-backdrop-color'?: string;
        }
    >({ ...rootStyle });

    // refs of DOMs
    const dialogRef = useRef<HTMLDialogElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const isFirstRender = useRef(true);

    // save rootStyle
    const rootStyleCached = useRef(rootStyle);

    // click shadow event
    const clickShadow: MouseEventHandler<HTMLDialogElement> = ev => {
        if (ev.target !== dialogRef.current) {
            return;
        }

        if (onClickShadow) {
            onClickShadow();
        }
    };

    // update rootStyle
    useEffect(() => {
        rootStyleCached.current = rootStyle;
    }, [rootStyle]);

    // open and close effect
    useEffect(() => {
        let inter: ReturnType<typeof setInterval> | null = null;
        let timer: ReturnType<typeof setTimeout> | null = null;

        if (dialogRef.current) {
            const { current: dialogDOM } = dialogRef;

            if (visible) {
                updateDialogStyle({
                    opacity: 1,
                    ['--var-backdrop-color']: `rgba(0, 0, 0, ${BACKDROP_BASE})`,
                    ...rootStyleCached.current,
                });

                dialogDOM.showModal();
            } else {
                if (!isFirstRender.current) {
                    let transCount = 1;

                    inter = setInterval(() => {
                        if (transCount === 10 && inter) {
                            clearInterval(inter);

                            timer = setTimeout(() => {
                                dialogDOM.close();
                                updateDialogStyle({});
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
                dialogRef.current = el;
                if (domRef) {
                    if (typeof domRef === 'function') {
                        domRef(el);
                    } else {
                        domRef.current = el;
                    }
                }
            }}
            className={classNames(styles.yModal, rootClass)}
            style={dialogStyle satisfies CSSProperties}
            onClick={clickShadow}
        >
            <div
                className={classNames(styles.yModalContent, innerClass)}
                style={innerStyle}
                ref={contentRef}
            >
                {children}
            </div>
        </dialog>
    );
};

/** @description Modal component using original `<dialog>` */
export default memo(forwardRef(Modal));
