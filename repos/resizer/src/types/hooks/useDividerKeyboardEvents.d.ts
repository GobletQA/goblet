import React from 'react';
import { KeyboardEventCoordinate } from '../dom';
import { PageSplitInput } from '../state';
export interface UseDividerKeyboardEventsProps<T extends Element> {
    readonly index: number;
    readonly element: T | null;
    readonly resizeInput: PageSplitInput | null;
    readonly coordinate: KeyboardEventCoordinate;
    readonly onFocus?: React.FocusEventHandler<T>;
    readonly onBlur?: React.FocusEventHandler<T>;
}
export interface UseDividerKeyboardEventsReturn<T extends Element> {
    readonly onFocus: React.FocusEventHandler<T>;
    readonly onBlur: React.FocusEventHandler<T>;
    readonly tabIndex: 0;
}
export declare function useDividerKeyboardEvents<T extends Element>(props: UseDividerKeyboardEventsProps<T>): UseDividerKeyboardEventsReturn<T>;
