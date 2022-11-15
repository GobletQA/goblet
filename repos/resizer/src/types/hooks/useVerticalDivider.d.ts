import { DividerProps } from '../components';
import { KeyboardEventCoordinate, MouseEventCoordinate, TouchEventCoordinate } from '../dom';
import { UseDividerReturn } from './useDivider';
declare type CoordinateProp = 'mouseCoordinate' | 'keyboardCoordinate' | 'touchCoordinate';
export interface UseVerticalDividerProps<T extends Element> extends Omit<DividerProps<T>, CoordinateProp> {
    /**
     * Calculates the vertical coordinate when clicking a divider.
     *
     * Defaults to {@link VerticalMouseCoordinate}.
     */
    readonly mouseCoordinate?: MouseEventCoordinate;
    /**
     * Calculates the vertical coordinate moving a divider via the keyboard.
     *
     * Defaults to {@link VerticalKeyboardCoordinate}.
     */
    readonly keyboardCoordinate?: KeyboardEventCoordinate;
    /**
     * Calculates the vertical coordinate when touching a divider.
     *
     * Defaults to {@link VerticalTouchCoordinate}.
     */
    readonly touchCoordinate?: TouchEventCoordinate;
}
export declare function useVerticalDivider<T extends Element>(props: UseVerticalDividerProps<T>): UseDividerReturn<T>;
export {};
