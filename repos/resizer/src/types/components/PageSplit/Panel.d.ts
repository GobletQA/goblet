import React from 'react';
import { UsePanelProps } from '../../hooks';
export declare type PanelProps<T extends Element = HTMLDivElement> = UsePanelProps<T>;
export declare const Panel: React.MemoExoticComponent<(props: PanelProps<HTMLDivElement>) => JSX.Element>;
