import React, { HTMLAttributes, RefCallback } from 'react';
import { KeyboardEventCoordinate, MouseEventCoordinate, TouchEventCoordinate } from '../dom';
import { PageSplitInput } from '../state';
export interface UseDividerProps<T extends Element> extends HTMLAttributes<T> {
    readonly index: number;
    readonly resizeInput: PageSplitInput | null;
    readonly mouseCoordinate: MouseEventCoordinate;
    readonly keyboardCoordinate: KeyboardEventCoordinate;
    readonly touchCoordinate: TouchEventCoordinate;
}
export interface UseDividerReturn<T extends Element> extends HTMLAttributes<T> {
    readonly ref: RefCallback<T>;
    readonly className: string;
    readonly onMouseDown: React.MouseEventHandler<T>;
    readonly onTouchStart: React.TouchEventHandler<T>;
    readonly onFocus: React.FocusEventHandler<T>;
    readonly onBlur: React.FocusEventHandler<T>;
}
export declare function useDivider<T extends Element>(props: UseDividerProps<T>): UseDividerReturn<T>;
