import type { CSSProperties, FC, ForwardRefRenderFunction, PropsWithChildren } from 'react';

export type CommonProps = Partial<{
    className: string;
    style: CSSProperties;
}>;

export type CommonComponents<P = Record<string, unknown>> = FC<P & CommonProps>;

export type FWC<P = Record<string, unknown>, E = HTMLDivElement> = ForwardRefRenderFunction<E, PropsWithChildren<P>>;

export type CommonFWC<P = Record<string, unknown>, E = HTMLDivElement> = ForwardRefRenderFunction<
    E,
    PropsWithChildren<P & CommonProps>
>;
