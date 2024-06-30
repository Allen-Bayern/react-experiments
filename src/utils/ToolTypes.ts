import type { CSSProperties, FC } from 'react';

export type CommonProps = Partial<{
    className: string;
    style: CSSProperties;
}>;

export type CommonComponents<P = {}> = FC<P & CommonProps>;
