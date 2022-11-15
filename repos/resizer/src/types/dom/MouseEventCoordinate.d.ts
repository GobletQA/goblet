export interface MouseEventCoordinate {
    (event: MouseEvent): number | null;
}
export declare const HorizontalMouseCoordinate: MouseEventCoordinate;
export declare const VerticalMouseCoordinate: MouseEventCoordinate;
