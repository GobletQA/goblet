import React from 'react';
import { TouchEventCoordinate } from '../dom';
import { PageSplitInput } from '../state';
export interface UseDividerTouchEventsProps<T extends Element> {
    readonly index: number;
    readonly element: T | null;
    readonly resizeInput: PageSplitInput | null;
    readonly coordinate: TouchEventCoordinate;
    readonly onTouchStart?: React.TouchEventHandler<T>;
}
export interface UseDividerTouchEventsReturn<T extends Element> {
    readonly onTouchStart: React.TouchEventHandler<T>;
}
export declare function useDividerTouchEvents<T extends Element>(props: UseDividerTouchEventsProps<T>): UseDividerTouchEventsReturn<T>;
