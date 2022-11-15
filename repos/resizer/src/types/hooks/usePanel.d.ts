import { HTMLAttributes, HTMLProps } from 'react';
import { PanelSize, PanelSizeProperty } from '../state';
export interface UsePanelProps<T extends Element> extends HTMLAttributes<T> {
    readonly index: number;
    readonly size: PanelSize;
    readonly sizeProperty: PanelSizeProperty;
}
export interface UsePanelReturn<T extends Element> {
    readonly mergedProps: boolean;
    readonly panelProps: HTMLProps<T>;
}
export declare function usePanel<T extends Element>(props: UsePanelProps<T>): UsePanelReturn<T>;
