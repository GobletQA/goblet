import { PanelSize, PanelSizeProperty } from '../state';
export declare type PanelsAction = SetSizePropertyAction | SetSizesAction | SetElementAction;
export interface SetSizePropertyAction {
    readonly type: 'SetSizeProperty';
    readonly property: PanelSizeProperty;
}
export interface SetSizesAction {
    readonly type: 'SetSizes';
    readonly sizes: readonly PanelSize[];
}
export interface SetElementAction {
    readonly type: 'SetElement';
    readonly index: number;
    readonly element: Element | null;
}
