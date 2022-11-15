export interface TouchEventCoordinate {
    (event: TouchEvent): number | null;
}
export declare const HorizontalTouchCoordinate: TouchEventCoordinate;
export declare const VerticalTouchCoordinate: TouchEventCoordinate;
