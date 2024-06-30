import type { CSSProperties, FC, ForwardRefRenderFunction, PropsWithChildren } from 'react';

export type CommonProps = Partial<{
    className: string;
    style: CSSProperties;
}>;

export type CommonComponents<P = {}> = FC<P & CommonProps>;

export type FWC<P = {}, E = HTMLDivElement> = ForwardRefRenderFunction<E, PropsWithChildren<P>>;

export type CommonFWC<P = {}, E = HTMLDivElement> = ForwardRefRenderFunction<E, PropsWithChildren<P & CommonProps>>;
