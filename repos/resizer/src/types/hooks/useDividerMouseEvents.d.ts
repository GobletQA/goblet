import React from 'react';
import { MouseEventCoordinate } from '../dom';
import { PageSplitInput } from '../state';
export interface UseDividerMouseEventsProps<T extends Element> {
    readonly index: number;
    readonly element: T | null;
    readonly resizeInput: PageSplitInput | null;
    readonly coordinate: MouseEventCoordinate;
    readonly onMouseDown?: React.MouseEventHandler<T>;
}
export interface UseDividerMouseEventsReturn<T extends Element> {
    readonly onMouseDown: React.MouseEventHandler<T>;
}
export declare function useDividerMouseEvents<T extends Element>(props: UseDividerMouseEventsProps<T>): UseDividerMouseEventsReturn<T>;
