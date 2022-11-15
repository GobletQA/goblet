import { DividerProps } from '../components';
import { KeyboardEventCoordinate, MouseEventCoordinate, TouchEventCoordinate } from '../dom';
import { UseDividerReturn } from './useDivider';
declare type CoordinateProp = 'mouseCoordinate' | 'keyboardCoordinate' | 'touchCoordinate';
export interface UseHorizontalDividerProps<T extends Element> extends Omit<DividerProps<T>, CoordinateProp> {
    /**
     * Calculates the horizontal coordinate when clicking a divider.
     *
     * Defaults to {@link HorizontalMouseCoordinate}.
     */
    readonly mouseCoordinate?: MouseEventCoordinate;
    /**
     * Calculates the horizontal coordinate moving a divider via the keyboard.
     *
     * Defaults to {@link HorizontalKeyboardCoordinate}.
     */
    readonly keyboardCoordinate?: KeyboardEventCoordinate;
    /**
     * Calculates the horizontal coordinate when touching a divider.
     *
     * Defaults to {@link HorizontalTouchCoordinate}.
     */
    readonly touchCoordinate?: TouchEventCoordinate;
}
export declare function useHorizontalDivider<T extends Element>(props: UseHorizontalDividerProps<T>): UseDividerReturn<T>;
export {};
