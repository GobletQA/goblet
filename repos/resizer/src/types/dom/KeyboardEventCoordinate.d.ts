export interface KeyboardEventCoordinate {
    (event: KeyboardEvent | FocusEvent): number | null;
}
export declare const HorizontalKeyboardCoordinate: KeyboardEventCoordinate;
export declare const VerticalKeyboardCoordinate: KeyboardEventCoordinate;
